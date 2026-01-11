import sqlite3
from typing import List, Dict, Optional
from datetime import datetime

from app.services.storage import Storage


class SQLiteStorage(Storage):
    """
    SQLite implementation of the Storage interface.

    This class is responsible for:
    - executing SQL queries
    - performing necessary joins
    - returning raw dictionaries to the service layer

    پیاده‌سازی SQLite برای لایه ذخیره‌سازی.
    """

    def __init__(self, db_path: str):
        self.db_path = db_path

    def _connect(self):
        """
        Create a SQLite connection with Row factory enabled.

        ایجاد اتصال به SQLite به‌طوری که خروجی‌ها dict-like باشند.
        """
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    # ==================================================
    # Alerts
    # ==================================================

    def list_alerts(self) -> List[Dict]:
        """
        Return all alerts enriched with patient name and device id.

        خروجی شامل اطلاعات بیمار و دستگاه است
        و مستقیماً برای UI قابل استفاده می‌باشد.
        """
        with self._connect() as conn:
            rows = conn.execute("""
                SELECT
                    a.alert_id,
                    a.severity,
                    a.status,
                    a.alert_type,
                    a.message,
                    a.generated_at,
                    a.reviewed_at,
                    a.reviewed_by,
                    a.clinical_note,
                    a.threshold_profile,

                    wa.assignment_id,
                    wa.wristband_id,
                    p.name AS patient_name

                FROM ALERT a
                JOIN WRISTBAND_ASSIGNMENT wa
                    ON a.assignment_id = wa.assignment_id
                JOIN PATIENT p
                    ON wa.patient_id = p.patient_id

                ORDER BY a.generated_at DESC
            """).fetchall()

            return [dict(r) for r in rows]

    def acknowledge_alert(
        self,
        alert_id: int,
        reviewed_by: Optional[str] = None,
        clinical_note: Optional[str] = None,
    ) -> None:
        """
        Mark an alert as acknowledged and store review metadata.

        هشدار را acknowledge می‌کند و اطلاعات بازبینی را ذخیره می‌کند.
        """
        with self._connect() as conn:
            conn.execute("""
                UPDATE ALERT
                SET
                    status = 'ACKNOWLEDGED',
                    acknowledged_at = CURRENT_TIMESTAMP,
                    reviewed_at = CURRENT_TIMESTAMP,
                    reviewed_by = ?,
                    clinical_note = ?
                WHERE alert_id = ?
            """, (reviewed_by, clinical_note, alert_id))
            conn.commit()

    # ==================================================
    # Patients
    # ==================================================

    def get_patients(self) -> List[Dict]:
        """
        Return all patients with their active device (if any).

        لیست بیماران به‌همراه دستگاه فعال فعلی (در صورت وجود).
        """
        with self._connect() as conn:
            rows = conn.execute("""
                SELECT
                    p.patient_id,
                    p.name AS patient_name,
                    w.wristband_id

                FROM PATIENT p
                LEFT JOIN WRISTBAND_ASSIGNMENT wa
                    ON p.patient_id = wa.patient_id
                    AND wa.end_date IS NULL
                LEFT JOIN WRISTBAND w
                    ON wa.wristband_id = w.wristband_id
            """).fetchall()

            return [dict(r) for r in rows]

    # ==================================================
    # Vitals
    # ==================================================

    def get_latest_vitals(self) -> List[Dict]:
        """
        Return the latest vital measurement for each active assignment.

        - Only assignments with end_date IS NULL
        - One latest measurement per assignment
        - Enriched with patient name and wristband id
        """
        with self._connect() as conn:
            rows = conn.execute("""
                SELECT
                    vm.assignment_id,
                    vm.measured_at,
                    vm.heart_rate,
                    vm.spo2,
                    vm.temperature,
                    vm.motion,
                    vm.battery_level,

                    wa.wristband_id,
                    p.name AS patient_name

                FROM VITAL_MEASUREMENT vm
                JOIN WRISTBAND_ASSIGNMENT wa
                    ON vm.assignment_id = wa.assignment_id
                JOIN PATIENT p
                    ON wa.patient_id = p.patient_id

                WHERE wa.end_date IS NULL
                  AND vm.measured_at = (
                      SELECT MAX(vm2.measured_at)
                      FROM VITAL_MEASUREMENT vm2
                      WHERE vm2.assignment_id = vm.assignment_id
                  )

                ORDER BY vm.measured_at DESC
            """).fetchall()

            return [dict(r) for r in rows]

    def get_vitals_history(
        self,
        assignment_id: int,
        limit: int = 50
    ) -> List[Dict]:
        """
        Return vitals history for a specific assignment.

        تاریخچه vitals برای یک assignment مشخص.
        """
        with self._connect() as conn:
            rows = conn.execute("""
                SELECT
                    vm.measured_at,
                    vm.heart_rate,
                    vm.spo2,
                    vm.temperature,
                    vm.motion,
                    vm.battery_level
                FROM VITAL_MEASUREMENT vm
                WHERE vm.assignment_id = ?
                ORDER BY vm.measured_at DESC
                LIMIT ?
            """, (assignment_id, limit)).fetchall()

            return [dict(r) for r in rows]

    # ==================================================
    # Battery / Device health
    # ==================================================

    def count_low_battery_devices(self, threshold: int) -> int:
        """
        Count active devices whose latest battery level
        is below the given threshold.

        شمارش wristbandهای فعال با باتری پایین
        (بر اساس آخرین vitals هر assignment).
        """
        with self._connect() as conn:
            row = conn.execute("""
                SELECT COUNT(*) AS low_battery_count
                FROM WRISTBAND_ASSIGNMENT wa
                JOIN VITAL_MEASUREMENT vm
                  ON wa.assignment_id = vm.assignment_id
                WHERE wa.end_date IS NULL
                  AND vm.measured_at = (
                      SELECT MAX(vm2.measured_at)
                      FROM VITAL_MEASUREMENT vm2
                      WHERE vm2.assignment_id = wa.assignment_id
                  )
                  AND vm.battery_level < ?
            """, (threshold,)).fetchone()

            return row["low_battery_count"] if row else 0
        
    def get_patients_overview(self):
        """
        Return an overview of all patients with:
        - active device assignment (if any)
        - latest vitals
        - latest active alert (if any)

        این متد فقط دیتای خام دیتابیس را برمی‌گرداند
        و هیچ منطق بیزنسی (risk status و ...) ندارد.
        """

        with self._connect() as conn:
            rows = conn.execute("""
                SELECT
                    p.patient_id,
                    p.name AS patient_name,
                    p.age,
                    p.gender,
                    p.phone,

                    wa.assignment_id,
                    w.wristband_id,

                    vm.measured_at AS last_update,
                    vm.heart_rate,
                    vm.spo2,
                    vm.temperature,
                    vm.battery_level,

                    la.severity AS latest_alert_severity

                FROM PATIENT p

                -- Active assignment for patient (if exists)
                LEFT JOIN WRISTBAND_ASSIGNMENT wa
                    ON wa.patient_id = p.patient_id
                AND wa.end_date IS NULL

                LEFT JOIN WRISTBAND w
                    ON w.wristband_id = wa.wristband_id

                -- Latest vitals per active assignment
                LEFT JOIN VITAL_MEASUREMENT vm
                    ON vm.assignment_id = wa.assignment_id
                AND vm.measured_at = (
                        SELECT MAX(v2.measured_at)
                        FROM VITAL_MEASUREMENT v2
                        WHERE v2.assignment_id = wa.assignment_id
                )

                -- Latest active alert per assignment
                LEFT JOIN ALERT la
                    ON la.assignment_id = wa.assignment_id
                AND la.status != 'ACKNOWLEDGED'
                AND la.generated_at = (
                        SELECT MAX(a2.generated_at)
                        FROM ALERT a2
                        WHERE a2.assignment_id = wa.assignment_id
                        AND a2.status != 'ACKNOWLEDGED'
                )

                ORDER BY p.name
            """).fetchall()

            return [dict(r) for r in rows]


    def get_patient_overview(self, patient_id: int):
        """
        Return overview data for a single patient.
        """
        with self._connect() as conn:
            row = conn.execute("""
                SELECT
                    p.patient_id,
                    p.name AS patient_name,
                    p.age,
                    p.gender,
                    p.phone,

                    wa.assignment_id,
                    w.wristband_id,

                    vm.measured_at AS last_update,
                    vm.heart_rate,
                    vm.spo2,
                    vm.temperature,
                    vm.battery_level,

                    la.severity AS latest_alert_severity

                FROM PATIENT p
                LEFT JOIN WRISTBAND_ASSIGNMENT wa
                    ON wa.patient_id = p.patient_id
                AND wa.end_date IS NULL
                LEFT JOIN WRISTBAND w
                    ON w.wristband_id = wa.wristband_id
                LEFT JOIN VITAL_MEASUREMENT vm
                    ON vm.assignment_id = wa.assignment_id
                AND vm.measured_at = (
                        SELECT MAX(v2.measured_at)
                        FROM VITAL_MEASUREMENT v2
                        WHERE v2.assignment_id = wa.assignment_id
                )
                LEFT JOIN ALERT la
                    ON la.assignment_id = wa.assignment_id
                AND la.status != 'ACKNOWLEDGED'
                AND la.generated_at = (
                        SELECT MAX(a2.generated_at)
                        FROM ALERT a2
                        WHERE a2.assignment_id = wa.assignment_id
                        AND a2.status != 'ACKNOWLEDGED'
                )
                WHERE p.patient_id = ?
            """, (patient_id,)).fetchone()

            return dict(row) if row else None

    def get_patient_alerts(self, patient_id: int):
        """
        Return all alerts related to a patient (across all assignments).

        تمام هشدارهای یک بیمار (حتی assignmentهای قبلی) را برمی‌گرداند.
        """
        with self._connect() as conn:
            rows = conn.execute("""
                SELECT
                    a.alert_id,
                    a.assignment_id,
                    a.generated_at,
                    a.message,
                    a.alert_type,
                    a.severity,
                    a.status,
                    wa.wristband_id
                FROM ALERT a
                JOIN WRISTBAND_ASSIGNMENT wa
                    ON a.assignment_id = wa.assignment_id
                WHERE wa.patient_id = ?
                ORDER BY a.generated_at DESC
            """, (patient_id,)).fetchall()

            return [dict(r) for r in rows]

    def create_patient(self, data: dict):
        """
        Insert a new patient into PATIENT table.

        داده‌های بیمار جدید را در دیتابیس ذخیره می‌کند
        و patient_id ساخته‌شده را برمی‌گرداند.
        """
        with self._connect() as conn:
            cursor = conn.execute(
                """
                INSERT INTO PATIENT (name, age, gender, phone, threshold_profile)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    data["name"],
                    data.get("age"),
                    data.get("gender"),
                    data.get("phone"),
                    data["threshold_profile"],
                ),
            )
            conn.commit()

            return {
                "patient_id": cursor.lastrowid,
                "name": data["name"],
            }
    # ======================================================

    def assign_wristband(self, patient_id: int, wristband_id: int) -> None:
        """
        Create a new wristband assignment for a patient.

        یک دستبند را به بیمار assign می‌کند.
        """
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO WRISTBAND_ASSIGNMENT (
                    patient_id,
                    wristband_id,
                    start_date
                )
                VALUES (?, ?, CURRENT_TIMESTAMP)
                """,
                (patient_id, wristband_id),
            )
            conn.commit()

    def create_wristband(self, wristband_id: int) -> dict:
        """
        Insert a new wristband into WRISTBAND table.

        - wristband_id توسط UI داده می‌شود.
        - created_at یا توسط DB پر می‌شود (DEFAULT) یا با CURRENT_TIMESTAMP.
        """
        with self._connect() as conn:
            # اگر created_at در جدول DEFAULT دارد:
            # conn.execute("INSERT INTO WRISTBAND (wristband_id) VALUES (?)", (wristband_id,))

            # نسخه سازگار (حتی اگر DEFAULT نداشته باشد):
            conn.execute(
                """
                INSERT INTO WRISTBAND (wristband_id, created_at)
                VALUES (?, CURRENT_TIMESTAMP)
                """,
                (wristband_id,),
            )
            conn.commit()

            row = conn.execute(
                "SELECT wristband_id, created_at FROM WRISTBAND WHERE wristband_id = ?",
                (wristband_id,),
            ).fetchone()

            return dict(row) if row else {"wristband_id": wristband_id, "created_at": None}

    def list_wristbands(self):
        """
        Return all wristbands in the system.
        """
        with self._connect() as conn:
            rows = conn.execute(
                """
                SELECT
                    wristband_id,
                    created_at
                FROM WRISTBAND
                ORDER BY wristband_id
                """
            ).fetchall()

        return [dict(r) for r in rows]


    def list_available_wristbands(self):
        """
        Return wristbands that do NOT have an active assignment.

        دستبندهایی که assignment فعال ندارند.
        """
        with self._connect() as conn:
            rows = conn.execute(
                """
                SELECT
                    w.wristband_id,
                    w.created_at
                FROM WRISTBAND w
                LEFT JOIN WRISTBAND_ASSIGNMENT wa
                    ON wa.wristband_id = w.wristband_id
                AND wa.end_date IS NULL
                WHERE wa.assignment_id IS NULL
                ORDER BY w.wristband_id
                """
            ).fetchall()

            return [dict(r) for r in rows]

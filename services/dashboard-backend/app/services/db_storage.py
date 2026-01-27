import sqlite3
from typing import List, Dict, Optional

from app.services.storage import Storage


class SQLiteStorage(Storage):
    """
    SQLite implementation of the Storage interface.

    Responsible for:
    - executing SQL queries
    - performing joins
    - returning raw dicts to service layer
    """

    def __init__(self, db_path: str):
        self.db_path = db_path

    def _connect(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    # ==================================================
    # Alerts
    # ==================================================

    def list_alerts(self) -> List[Dict]:
        """
        Return all alerts enriched with patient name and wristband id.
        Suitable for dashboard UI.
        """
        with self._connect() as conn:
            rows = conn.execute("""
                SELECT
                    a.alert_id,
                    a.assignment_id,
                    a.generated_at,
                    a.severity,
                    a.status,
                    a.alert_type,
                    a.threshold_profile,
                    a.description,
                    a.full_description,
                    a.metric,
                    a.value,
                    a.reviewed_at,
                    a.reviewed_by,
                    a.clinical_note,

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
        Mark an alert as acknowledged.
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

    def get_patient_alerts(self, patient_id: int) -> List[Dict]:
        """
        Return all alerts for a specific patient
        (including previous assignments).
        """
        with self._connect() as conn:
            rows = conn.execute("""
                SELECT
                    a.alert_id,
                    a.assignment_id,
                    a.generated_at,
                    a.severity,
                    a.status,
                    a.alert_type,
                    a.threshold_profile,
                    a.description,
                    a.full_description,
                    a.metric,
                    a.value,

                    wa.wristband_id
                FROM ALERT a
                JOIN WRISTBAND_ASSIGNMENT wa
                    ON a.assignment_id = wa.assignment_id
                WHERE wa.patient_id = ?
                ORDER BY a.generated_at DESC
            """, (patient_id,)).fetchall()

            return [dict(r) for r in rows]

    # ==================================================
    # Patients
    # ==================================================

    def get_patients(self) -> List[Dict]:
        """
        Return all patients with:
        - active wristband (if any)
        - latest vitals (if any)
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
                    vm.battery_level

                FROM PATIENT p

                -- Active assignment (if exists)
                LEFT JOIN WRISTBAND_ASSIGNMENT wa
                    ON wa.patient_id = p.patient_id
                AND wa.end_date IS NULL

                LEFT JOIN WRISTBAND w
                    ON w.wristband_id = wa.wristband_id

                -- Latest vitals per assignment
                LEFT JOIN VITAL_MEASUREMENT vm
                    ON vm.assignment_id = wa.assignment_id
                AND vm.measured_at = (
                    SELECT MAX(vm2.measured_at)
                    FROM VITAL_MEASUREMENT vm2
                    WHERE vm2.assignment_id = wa.assignment_id
                )

                ORDER BY p.name
            """).fetchall()

            return [dict(r) for r in rows] 


    # ==================================================
    # Single Patient
    # ==================================================

    def get_patient_overview(self, patient_id: int) -> Optional[Dict]:
        """
        Return overview data for a single patient:
        - basic info
        - active assignment (if any)
        - latest vitals
        - latest active alert severity
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

                -- Latest vitals
                LEFT JOIN VITAL_MEASUREMENT vm
                    ON vm.assignment_id = wa.assignment_id
                AND vm.measured_at = (
                        SELECT MAX(v2.measured_at)
                        FROM VITAL_MEASUREMENT v2
                        WHERE v2.assignment_id = wa.assignment_id
                )

                -- Latest active alert
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

    # ==================================================
    # Vitals
    # ==================================================

    def get_latest_vitals(self) -> List[Dict]:
        """
        Return latest vitals per active assignment.
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
        patient_id: int,
        limit: int = 50
    ) -> List[Dict]:
        """
        Return vitals history for a patient (based on active assignment).

        - patient-based (UI safe)
        - device reuse safe
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
                JOIN WRISTBAND_ASSIGNMENT wa
                    ON vm.assignment_id = wa.assignment_id
                WHERE wa.patient_id = ?
                AND wa.end_date IS NULL
                ORDER BY vm.measured_at DESC
                LIMIT ?
            """, (patient_id, limit)).fetchall()

            return [dict(r) for r in rows]  


    # ==================================================
    # Battery / Device health
    # ==================================================

    def count_low_battery_devices(self, threshold: int) -> int:
        """
        Count active devices with battery below threshold.
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

    # ==================================================
    # Wristbands
    # ==================================================

    def list_wristbands(self) -> List[Dict]:
        """
        Return all wristbands with assigned patient (if any).
        """
        with self._connect() as conn:
            rows = conn.execute("""
                SELECT
                    w.wristband_id,
                    w.created_at,
                    p.name AS assigned_to
                FROM WRISTBAND w
                LEFT JOIN WRISTBAND_ASSIGNMENT wa
                    ON wa.wristband_id = w.wristband_id
                    AND wa.end_date IS NULL
                LEFT JOIN PATIENT p
                    ON p.patient_id = wa.patient_id
                ORDER BY w.wristband_id
            """).fetchall()

            return [
                {
                    "wristband_id": r["wristband_id"],
                    "created_at": r["created_at"],
                    "assignedTo": r["assigned_to"],
                }
                for r in rows
            ]

    def list_available_wristbands(self) -> List[Dict]:
        """
        Return wristbands without active assignment.
        """
        with self._connect() as conn:
            rows = conn.execute("""
                SELECT
                    w.wristband_id,
                    w.created_at
                FROM WRISTBAND w
                LEFT JOIN WRISTBAND_ASSIGNMENT wa
                    ON wa.wristband_id = w.wristband_id
                    AND wa.end_date IS NULL
                WHERE wa.assignment_id IS NULL
                ORDER BY w.wristband_id
            """).fetchall()

            return [dict(r) for r in rows]

    # ==================================================
    # Create / Assign
    # ==================================================

    def create_patient(self, data: dict) -> Dict:
        with self._connect() as conn:
            cursor = conn.execute("""
                INSERT INTO PATIENT (name, age, gender, phone, threshold_profile)
                VALUES (?, ?, ?, ?, ?)
            """, (
                data["name"],
                data.get("age"),
                data.get("gender"),
                data.get("phone"),
                data["threshold_profile"],
            ))
            conn.commit()

            return {
                "patient_id": cursor.lastrowid,
                "name": data["name"],
            }

    def assign_wristband(self, patient_id: int, wristband_id: int) -> None:
        with self._connect() as conn:
            conn.execute("""
                INSERT INTO WRISTBAND_ASSIGNMENT (
                    patient_id,
                    wristband_id,
                    start_date
                )
                VALUES (?, ?, CURRENT_TIMESTAMP)
            """, (patient_id, wristband_id))
            conn.commit()

    def create_wristband(self, wristband_id: int) -> Dict:
        with self._connect() as conn:
            conn.execute("""
                INSERT INTO WRISTBAND (wristband_id, created_at)
                VALUES (?, CURRENT_TIMESTAMP)
            """, (wristband_id,))
            conn.commit()

            row = conn.execute("""
                SELECT wristband_id, created_at
                FROM WRISTBAND
                WHERE wristband_id = ?
            """, (wristband_id,)).fetchone()

            return dict(row) if row else {}

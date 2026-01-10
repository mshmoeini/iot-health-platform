import sqlite3
from typing import List, Dict, Optional

from app.services.storage import Storage
from app.models.schemas import AlertStatus


class SQLiteStorage(Storage):
    def __init__(self, db_path: str):
        self.db_path = db_path

    def _connect(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    # --------------------------------------------------
    # Alerts
    # --------------------------------------------------

    def list_alerts(self) -> List[Dict]:
        with self._connect() as conn:
            rows = conn.execute("""
                SELECT *
                FROM ALERT
                ORDER BY generated_at DESC
            """).fetchall()
            return [dict(row) for row in rows]

    def list_alerts_with_wristband(self):
        """
        Return alerts joined with wristband_id through assignment.
        """
        with self._connect() as conn:
            rows = conn.execute("""
                SELECT
                    a.*,
                    wa.wristband_id
                FROM ALERT a
                JOIN WRISTBAND_ASSIGNMENT wa
                  ON a.assignment_id = wa.assignment_id
                ORDER BY a.generated_at DESC
            """).fetchall()

        return [dict(row) for row in rows]

    def list_unacknowledged_alerts(
        self,
        limit: Optional[int] = None
    ) -> List[Dict]:
        query = """
            SELECT *
            FROM ALERT
            WHERE status != ?
            ORDER BY generated_at DESC
        """
        params = [AlertStatus.ACKNOWLEDGED]

        if limit is not None:
            query += " LIMIT ?"
            params.append(limit)

        with self._connect() as conn:
            rows = conn.execute(query, params).fetchall()
            return [dict(row) for row in rows]

    def count_unacknowledged_alerts(self) -> int:
        with self._connect() as conn:
            row = conn.execute("""
                SELECT COUNT(*) AS cnt
                FROM ALERT
                WHERE status != ?
            """, (AlertStatus.ACKNOWLEDGED,)).fetchone()
            return row["cnt"]

    def acknowledge_alert(
        self,
        alert_id: int,
        reviewed_by: Optional[str] = None,
        clinical_note: Optional[str] = None,
    ) -> None:
        with self._connect() as conn:
            conn.execute("""
                UPDATE ALERT
                SET
                    status = ?,
                    acknowledged_at = CURRENT_TIMESTAMP,
                    reviewed_at = CURRENT_TIMESTAMP,
                    reviewed_by = ?,
                    clinical_note = ?
                WHERE alert_id = ?
            """, (
                AlertStatus.ACKNOWLEDGED,
                reviewed_by,
                clinical_note,
                alert_id,
            ))
            conn.commit()

    # --------------------------------------------------
    # Patients
    # --------------------------------------------------

    def get_patients(self) -> List[Dict]:
        with self._connect() as conn:
            rows = conn.execute("""
                SELECT *
                FROM PATIENT
            """).fetchall()
            return [dict(row) for row in rows]

    # --------------------------------------------------
    # Vitals
    # --------------------------------------------------

    def get_latest_vitals(self, patient_id: int) -> Optional[Dict]:
        with self._connect() as conn:
            row = conn.execute("""
                SELECT vm.*
                FROM VITAL_MEASUREMENT vm
                JOIN WRISTBAND_ASSIGNMENT wa
                  ON vm.assignment_id = wa.assignment_id
                WHERE wa.patient_id = ?
                  AND wa.end_date IS NULL
                ORDER BY vm.measured_at DESC
                LIMIT 1
            """, (patient_id,)).fetchone()

            return dict(row) if row else None

    def get_latest_vitals_with_battery(
        self,
        patient_id: int
    ) -> Optional[Dict]:
        """
        Return the latest vitals row including battery level
        for the given patient.
        """
        vitals = self.get_latest_vitals(patient_id)
        if not vitals:
            return None

        # battery_level column must exist in VITAL_MEASUREMENT
        return {
            "battery_level": vitals.get("battery_level"),
            "measured_at": vitals.get("measured_at"),
        }
    
 # --------------------------------------------------
    # Vitals histpry
    # --------------------------------------------------

    def get_vitals_history(
        self,
        patient_id: int,
        limit: int = 50
    ) -> List[Dict]:
        """
        Return vitals history for a patient (latest first).

        This method is required by the Storage abstract interface.
        """
        with self._connect() as conn:
            rows = conn.execute("""
                SELECT vm.*
                FROM VITAL_MEASUREMENT vm
                JOIN WRISTBAND_ASSIGNMENT wa
                  ON vm.assignment_id = wa.assignment_id
                WHERE wa.patient_id = ?
                ORDER BY vm.measured_at DESC
                LIMIT ?
            """, (patient_id, limit)).fetchall()

            return [dict(row) for row in rows]

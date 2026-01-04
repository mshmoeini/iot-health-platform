# app/services/db_storage.py
import sqlite3
from typing import List, Dict, Optional
from app.services.storage import Storage


class SQLiteStorage(Storage):
    def __init__(self, db_path: str):
        self.db_path = db_path

    def _connect(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    # -------- Alerts --------
    def list_alerts(self) -> List[Dict]:
        with self._connect() as conn:
            rows = conn.execute("""
                SELECT *
                FROM ALERT
                ORDER BY generated_at DESC
            """).fetchall()
            return [dict(row) for row in rows]

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
                    status = 'ACKNOWLEDGED',
                    acknowledged_at = CURRENT_TIMESTAMP,
                    reviewed_at = CURRENT_TIMESTAMP,
                    reviewed_by = ?,
                    clinical_note = ?
                WHERE alert_id = ?
            """, (reviewed_by, clinical_note, alert_id))
            conn.commit()

    # -------- Patients --------
    def get_patients(self) -> List[Dict]:
        with self._connect() as conn:
            rows = conn.execute("""
                SELECT *
                FROM PATIENT
            """).fetchall()
            return [dict(row) for row in rows]

    # -------- Vitals --------
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

    def get_vitals_history(
        self,
        patient_id: int,
        limit: int = 50
    ) -> List[Dict]:
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

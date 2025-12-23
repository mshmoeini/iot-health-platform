import os
from datetime import datetime

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from storage.base import Base, StorageBackend
from models import VitalMeasurement, Alert


DB_PATH = os.getenv("DB_PATH", "/app/data/health.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class LocalStorage(StorageBackend):
    """
    Local SQLite storage backend.
    Cloud backend will be implemented in cloud.py later.
    """

    def save_vital(self, assignment_id: int, data: dict) -> None:
        session = SessionLocal()
        try:
            measured_at = data.get("measured_at")
            if measured_at:
                try:
                    measured_at = datetime.fromisoformat(
                        measured_at.replace("Z", "+00:00")
                    )
                except Exception:
                    measured_at = datetime.utcnow()
            else:
                measured_at = datetime.utcnow()

            row = VitalMeasurement(
                assignment_id=assignment_id,
                measured_at=measured_at,
                heart_rate=data.get("heart_rate"),
                spo2=data.get("spo2"),
                temperature=data.get("temperature"),
                motion=data.get("motion"),
                battery_level=data.get("battery_level"),
            )

            session.add(row)
            session.commit()
        finally:
            session.close()

    def save_alert(self, assignment_id: int, data: dict) -> None:
        session = SessionLocal()
        try:
            generated_at = data.get("generated_at")
            if generated_at:
                try:
                    generated_at = datetime.fromisoformat(
                        generated_at.replace("Z", "+00:00")
                    )
                except Exception:
                    generated_at = datetime.utcnow()
            else:
                generated_at = datetime.utcnow()

            row = Alert(
                assignment_id=assignment_id,
                generated_at=generated_at,
                message=data["message"],
                alert_type=data["alert_type"],
                severity=data["severity"],
                status=data.get("status", "JUST_GENERATED"),
                threshold_profile=data["threshold_profile"],
            )

            session.add(row)
            session.commit()
        finally:
            session.close()


    def get_latest(self, assignment_id: int):
        """
        Phase 1: not implemented yet
        """
        return None



    def get_history(self, assignment_id: int, start=None, end=None):
        """
        Phase 1: not implemented yet
        """
        return []
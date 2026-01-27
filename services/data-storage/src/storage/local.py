<<<<<<< HEAD
import os
from datetime import datetime

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from storage.base import Base, StorageBackend
from models import VitalMeasurement, Alert


# ----------------------------
# Database setup
# ----------------------------
DB_PATH = os.getenv("DB_PATH", "/app/data/health.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


# ----------------------------
# Storage implementation
# ----------------------------
class LocalStorage(StorageBackend):
    """
    Local SQLite storage backend.
    Owns persistence logic and DB schema.
    """

    # ----------------------------
    # VITALS
    # ----------------------------
    def save_vital(self, assignment_id: int, data: dict) -> None:
        session = SessionLocal()
        try:
            measured_at = self._parse_datetime(data.get("measured_at"))

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

    # ----------------------------
    # ALERTS (final, UI-ready)
    # ----------------------------
    def save_alert(self, assignment_id: int, data: dict) -> None:
        session = SessionLocal()
        try:
            generated_at = self._parse_datetime(data.get("generated_at"))

            row = Alert(
                assignment_id=assignment_id,
                generated_at=generated_at,

                alert_type=data["alert_type"],
                severity=data["severity"],
                status=data.get("status", "JUST_GENERATED"),
                threshold_profile=data["threshold_profile"],

                metric=data["metric"],
                value=data["value"],

                description=data["description"],
                full_description=data["full_description"],
            )

            session.add(row)
            session.commit()
        finally:
            session.close()

    # ----------------------------
    # Helpers
    # ----------------------------
    @staticmethod
    def _parse_datetime(value):
        if not value:
            return datetime.utcnow()

        if isinstance(value, datetime):
            return value

        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00"))
        except Exception:
            return datetime.utcnow()

    # ----------------------------
    # Query API (future phases)
    # ----------------------------
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
=======
import os
from datetime import datetime

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from storage.base import Base, StorageBackend
from models import VitalMeasurement, Alert


# ----------------------------
# Database setup
# ----------------------------
DB_PATH = os.getenv("DB_PATH", "/app/data/health.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


# ----------------------------
# Storage implementation
# ----------------------------
class LocalStorage(StorageBackend):
    """
    Local SQLite storage backend.
    Owns persistence logic and DB schema.
    """

    # ----------------------------
    # VITALS
    # ----------------------------
    def save_vital(self, assignment_id: int, data: dict) -> None:
        session = SessionLocal()
        try:
            measured_at = self._parse_datetime(data.get("measured_at"))

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

    # ----------------------------
    # ALERTS (final, UI-ready)
    # ----------------------------
    def save_alert(self, assignment_id: int, data: dict) -> None:
        session = SessionLocal()
        try:
            generated_at = self._parse_datetime(data.get("generated_at"))

            row = Alert(
                assignment_id=assignment_id,
                generated_at=generated_at,

                alert_type=data["alert_type"],
                severity=data["severity"],
                status=data.get("status", "JUST_GENERATED"),
                threshold_profile=data["threshold_profile"],

                metric=data["metric"],
                value=data["value"],

                description=data["description"],
                full_description=data["full_description"],
            )

            session.add(row)
            session.commit()
        finally:
            session.close()

    # ----------------------------
    # Helpers
    # ----------------------------
    @staticmethod
    def _parse_datetime(value):
        if not value:
            return datetime.utcnow()

        if isinstance(value, datetime):
            return value

        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00"))
        except Exception:
            return datetime.utcnow()

    # ----------------------------
    # Query API (future phases)
    # ----------------------------
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
>>>>>>> 166f8a9b86e641d57f616c5eae54d40036eea3c6

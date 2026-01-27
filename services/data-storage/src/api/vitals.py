<<<<<<< HEAD
from fastapi import APIRouter, Query
from sqlalchemy.orm import Session

from storage.local import SessionLocal
from models import VitalMeasurement

router = APIRouter(prefix="/vitals", tags=["vitals"])


@router.get("/history")
def get_vitals_history(
    assignment_id: int = Query(...),
    limit: int = Query(100, le=500)
):
    """
    Return historical vital measurements for an assignment.
    """
    session: Session = SessionLocal()
    try:
        rows = (
            session.query(VitalMeasurement)
            .filter(VitalMeasurement.assignment_id == assignment_id)
            .order_by(VitalMeasurement.measured_at.desc())
            .limit(limit)
            .all()
        )

        return [
            {
                "measured_at": r.measured_at.isoformat(),
                "heart_rate": r.heart_rate,
                "spo2": r.spo2,
                "temperature": r.temperature,
                "motion": r.motion,
                "battery_level": r.battery_level,
            }
            for r in rows
        ]
    finally:
        session.close()
=======
from fastapi import APIRouter, Query
from sqlalchemy.orm import Session

from storage.local import SessionLocal
from models import VitalMeasurement

router = APIRouter(prefix="/vitals", tags=["vitals"])


@router.get("/history")
def get_vitals_history(
    assignment_id: int = Query(...),
    limit: int = Query(100, le=500)
):
    """
    Return historical vital measurements for an assignment.
    """
    session: Session = SessionLocal()
    try:
        rows = (
            session.query(VitalMeasurement)
            .filter(VitalMeasurement.assignment_id == assignment_id)
            .order_by(VitalMeasurement.measured_at.desc())
            .limit(limit)
            .all()
        )

        return [
            {
                "measured_at": r.measured_at.isoformat(),
                "heart_rate": r.heart_rate,
                "spo2": r.spo2,
                "temperature": r.temperature,
                "motion": r.motion,
                "battery_level": r.battery_level,
            }
            for r in rows
        ]
    finally:
        session.close()
>>>>>>> 166f8a9b86e641d57f616c5eae54d40036eea3c6

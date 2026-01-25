from fastapi import APIRouter, Query
from sqlalchemy.orm import Session

from storage.local import SessionLocal
from models import Alert

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("/history")
def get_alerts_history(
    assignment_id: int = Query(...),
    limit: int = Query(50, le=200)
):
    """
    Return alert history for an assignment.
    """
    session: Session = SessionLocal()
    try:
        rows = (
            session.query(Alert)
            .filter(Alert.assignment_id == assignment_id)
            .order_by(Alert.generated_at.desc())
            .limit(limit)
            .all()
        )

        return [
            {
                "alert_id": a.alert_id,
                "generated_at": a.generated_at.isoformat(),
                "severity": a.severity,
                "status": a.status,
                "metric": a.metric,
                "value": a.value,
                "description": a.description,
                "full_description": a.full_description,
                "threshold_profile": a.threshold_profile,
            }
            for a in rows
        ]
    finally:
        session.close()

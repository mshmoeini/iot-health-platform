from fastapi import APIRouter, Depends

from app.services.container import get_storage
from app.services.storage import Storage

router = APIRouter()


@router.get(
    "/latest",
    summary="Get latest vitals for all active patients",
    description="Return the latest vital measurements for each active assignment.",
)
def get_latest_vitals(db: Storage = Depends(get_storage)):
    """
    Get latest vitals for all active assignments.

    - Assignment-centric
    - Used mainly for dashboards or monitoring views
    """
    return db.get_latest_vitals()


@router.get(
    "/{assignment_id}/history",
    summary="Get vitals history for an assignment",
    description="Return historical vital measurements for a specific assignment.",
)
def get_vitals_history(
    assignment_id: int,
    limit: int = 50,
    db: Storage = Depends(get_storage),
):
    """
    Get vitals history for a specific assignment.

    - Medical-safe (assignment-based)
    - Device reuse safe
    """
    return db.get_vitals_history(assignment_id, limit)

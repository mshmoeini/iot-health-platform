from fastapi import APIRouter, Depends

from app.models.schemas import DashboardOverviewResponse
from app.services.dashboard_service import get_dashboard_overview
from app.services.storage import Storage
from app.services.container import storage

router = APIRouter()


def get_storage() -> Storage:
    """
    Simple dependency provider for the configured Storage implementation.
    Currently returns the SQLite-backed storage from app.services.container.
    """
    return storage


@router.get(
    "/overview",
    response_model=DashboardOverviewResponse,
    summary="Get dashboard overview",
    description="Aggregated metrics and recent alerts for the main dashboard overview page.",
)
def dashboard_overview(db: Storage = Depends(get_storage)):
    """
    Dashboard Overview API endpoint.

    This endpoint:
    - Aggregates system-level KPIs (counts, status summaries)
    - Returns UI-friendly response models (no DB schema leakage)
    - Does NOT subscribe to MQTT topics (REST only)
    """
    return get_dashboard_overview(db)

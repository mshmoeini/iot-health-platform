from fastapi import APIRouter
from app.services.container import storage

router = APIRouter()

@router.get("/")
def get_alerts():
    return storage.list_alerts()

@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: int):
    storage.acknowledge_alert(alert_id)
    return {"status": "acknowledged"}

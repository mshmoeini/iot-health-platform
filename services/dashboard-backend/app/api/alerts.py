from fastapi import APIRouter
from app.services.fake_storage import ALERTS


router = APIRouter()

@router.get("/")
def get_alerts():
    return ALERTS

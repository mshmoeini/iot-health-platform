from fastapi import APIRouter
from app.services.fake_storage import VITALS


router = APIRouter()

@router.get("/{patient_id}")
def get_latest_vitals(patient_id: int):
    return VITALS.get(patient_id, {})

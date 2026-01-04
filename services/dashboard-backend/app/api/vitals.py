from fastapi import APIRouter
from app.services.container import storage

router = APIRouter()

@router.get("/{patient_id}")
def get_latest_vitals(patient_id: int):
    return storage.get_latest_vitals(patient_id)

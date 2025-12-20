from fastapi import APIRouter
from app.services.fake_storage import PATIENTS


router = APIRouter()

@router.get("/")
def get_patients():
    return PATIENTS

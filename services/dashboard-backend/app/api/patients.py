from fastapi import APIRouter
from app.services.container import storage

router = APIRouter()

@router.get("/")
def get_patients():
    return storage.get_patients()

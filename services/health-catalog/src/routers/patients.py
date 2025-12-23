from fastapi import APIRouter, HTTPException
from pathlib import Path
import json
from datetime import datetime

router = APIRouter()

CONFIG_PATH = Path(__file__).resolve().parents[2] / "config" / "patients.json"


@router.get("/patients/{id}")
def get_patient_by_id(id: int):
    """
    Returns patient details by patientId.
    """
    try:
        with open(CONFIG_PATH, "r") as file:
            payload = json.load(file)

        patients = payload.get("patients", [])
        patient = next((p for p in patients if p.get("patientId") == id), None)

        if patient is None:
            raise HTTPException(status_code=404, detail=f"Patient with id={id} not found")

        return {
            "status": "success",
            "data": patient,
            "timestamp": datetime.utcnow().isoformat()
        }

    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="patients.json file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="patients.json is not valid JSON")

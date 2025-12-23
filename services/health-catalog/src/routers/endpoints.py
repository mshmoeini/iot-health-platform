from fastapi import APIRouter, HTTPException
from pathlib import Path
import json
from datetime import datetime

router = APIRouter()

# مسیر فایل endpoints.json
CONFIG_PATH = Path(__file__).resolve().parents[2] / "config" / "endpoints.json"


@router.get("/endpoints")
def get_endpoints():
    """
    Returns base URLs of all internal services.
    """
    try:
        with open(CONFIG_PATH, "r") as file:
            endpoints = json.load(file)

        return {
            "status": "success",
            "data": endpoints,
            "timestamp": datetime.utcnow().isoformat()
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=500,
            detail="endpoints.json file not found"
        )

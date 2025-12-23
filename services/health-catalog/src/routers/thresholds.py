from fastapi import APIRouter, HTTPException
import json
from pathlib import Path
from datetime import datetime

router = APIRouter()

# مسیر فایل thresholds.json
CONFIG_PATH = Path(__file__).resolve().parents[2] / "config" / "thresholds.json"


@router.get("/thresholds")
def get_thresholds():
    """
    Returns health thresholds for vital signs.
    Used by Risk Analysis and Backend services.
    """
    try:
        with open(CONFIG_PATH, "r") as file:
            thresholds = json.load(file)

        return {
            "status": "success",
            "data": thresholds,
            "timestamp": datetime.utcnow().isoformat()
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=500,
            detail="thresholds.json file not found"
        )

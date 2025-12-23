from fastapi import APIRouter, HTTPException
from pathlib import Path
import json
from datetime import datetime

router = APIRouter()

# مسیر فایل topics.json
CONFIG_PATH = Path(__file__).resolve().parents[2] / "config" / "topics.json"


@router.get("/topics")
def get_topics():
    """
    Returns MQTT topic definitions used across the system.
    """
    try:
        with open(CONFIG_PATH, "r") as file:
            topics = json.load(file)

        return {
            "status": "success",
            "data": topics,
            "timestamp": datetime.utcnow().isoformat()
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=500,
            detail="topics.json file not found"
        )

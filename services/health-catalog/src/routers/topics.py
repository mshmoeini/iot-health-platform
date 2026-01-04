from fastapi import APIRouter, HTTPException
from pathlib import Path
import json
from datetime import datetime

router = APIRouter()

CONFIG_PATH = Path("/app/config/mqtt_topics.json")


@router.get("/topics")
def get_topics():
    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as file:
            topics = json.load(file)

        return {
            "status": "success",
            "data": topics,
            "timestamp": datetime.utcnow().isoformat()
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=500,
            detail=f"Config file not found: {CONFIG_PATH}"
        )

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Invalid JSON format in mqtt_topics.json"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

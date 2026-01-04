from fastapi import APIRouter, HTTPException
from pathlib import Path
import json
from datetime import datetime

router = APIRouter()

CONFIG_PATH = Path("/app/config/services.json")


@router.get("/endpoints")
def get_endpoints():
    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as file:
            services = json.load(file)

        return {
            "status": "success",
            "data": services,
            "timestamp": datetime.utcnow().isoformat()
        }

    except FileNotFoundError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Config file not found: {CONFIG_PATH}"
        )

    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid JSON format in services.json"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

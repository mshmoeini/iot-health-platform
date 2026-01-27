<<<<<<< HEAD
from fastapi import APIRouter, HTTPException
from datetime import datetime
from src.core.config_loader import load_config

router = APIRouter()


@router.get("/topics")
def get_mqtt_topics():
    try:
        data = load_config("mqtt_topics.json")
        return {
            "status": "success",
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
=======
from fastapi import APIRouter, HTTPException
from datetime import datetime
from src.core.config_loader import load_config

router = APIRouter()


@router.get("/topics")
def get_mqtt_topics():
    try:
        data = load_config("mqtt_topics.json")
        return {
            "status": "success",
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
>>>>>>> 166f8a9b86e641d57f616c5eae54d40036eea3c6

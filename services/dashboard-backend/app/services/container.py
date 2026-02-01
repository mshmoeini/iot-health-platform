# app/services/container.py

import os
from functools import lru_cache
from app.services.rest_storage_client import RESTStorageClient
from app.services.storage import Storage


# --------------------------------------------------
# Database configuration
# --------------------------------------------------
DB_PATH = os.getenv("DB_PATH", "/app/data/health.db")


@lru_cache
def get_storage() -> Storage:
    """
    Returns a singleton-like instance of the storage layer.

    - Uses lazy initialization
    - Allows future replacement (e.g., PostgresStorage)
    - Avoids uncontrolled global state
    
    """
    return RESTStorageClient()
# ======================================================

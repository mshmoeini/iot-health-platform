# app/services/container.py

import os
from functools import lru_cache

from app.services.db_storage import SQLiteStorage


# --------------------------------------------------
# Database configuration
# --------------------------------------------------
DB_PATH = os.getenv("DB_PATH", "/app/data/health.db")


@lru_cache
def get_storage() -> SQLiteStorage:
    """
    Returns a singleton-like instance of the storage layer.

    - Uses lazy initialization
    - Allows future replacement (e.g., PostgresStorage)
    - Avoids uncontrolled global state

    این تابع یک instance از storage برمی‌گرداند
    که در کل اپلیکیشن به‌صورت کنترل‌شده استفاده می‌شود.
    """
    return SQLiteStorage(DB_PATH)
# ======================================================

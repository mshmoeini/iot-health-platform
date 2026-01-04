
# app/services/container.py
from app.services.db_storage import SQLiteStorage

DB_PATH = "/app/data/health.db"

storage = SQLiteStorage(DB_PATH)

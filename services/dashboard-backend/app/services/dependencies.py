# app/services/dependencies.py

from functools import lru_cache
from app.services.storage_client import RESTDataStorageClient


@lru_cache
def get_storage():
    return RESTDataStorageClient()

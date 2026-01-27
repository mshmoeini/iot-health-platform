<<<<<<< HEAD
# app/services/dependencies.py

from functools import lru_cache
from app.services.storage_client import RESTDataStorageClient


@lru_cache
def get_storage():
    return RESTDataStorageClient()
=======
# app/services/dependencies.py

from functools import lru_cache
from app.services.storage_client import RESTDataStorageClient


@lru_cache
def get_storage():
    return RESTDataStorageClient()
>>>>>>> 166f8a9b86e641d57f616c5eae54d40036eea3c6

from storage.base import Base
from storage.local import engine
import models  # noqa: F401  (needed to register models)
from mqtt_client import start_mqtt


def init_db():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    print("[MAIN] starting data-storage service")
    init_db()
    print("[MAIN] database initialized")
    start_mqtt()

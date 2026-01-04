from storage.base import Base
from storage.local import engine
import models  # noqa: F401  (needed to register models)
from mqtt_client import start_mqtt
from config_loader import load_health_catalog_config


def init_db():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    print("[MAIN] starting data-storage service")
    init_db()
    print("[MAIN] database initialized")
    config = load_health_catalog_config()
    print("[MAIN] configuration loaded from Health Catalog")
    print(config)
    start_mqtt(config)

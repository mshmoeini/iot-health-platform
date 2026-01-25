import json
import time
import random
from datetime import datetime, timezone
import paho.mqtt.publish as publish

BROKER = "localhost"
PORT = 1883

# --------------------------------
# Simulated wristbands (devices only)
# --------------------------------
WRISTBAND_IDS = [1, 2, 3]

VITALS_INTERVAL_SEC = 5

while True:
    now_iso = datetime.now(timezone.utc).isoformat()

    for wristband_id in WRISTBAND_IDS:
        vitals_payload = {
            "wristband_id": wristband_id,
            "measured_at": now_iso,
            "heart_rate": random.randint(55, 160),
            "spo2": random.randint(88, 100),
            "temperature": round(random.uniform(35.8, 38.8), 1),
            "motion": round(random.uniform(0.0, 1.5), 2),
            "battery_level": random.randint(20, 100),
        }

        topic = f"wristbands/{wristband_id}/vitals"

        publish.single(
            topic=topic,
            payload=json.dumps(vitals_payload),
            hostname=BROKER,
            port=PORT,
            qos=0
        )

        print(f"[SIM] Published VITALS → {topic}")

    time.sleep(VITALS_INTERVAL_SEC)

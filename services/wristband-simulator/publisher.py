import json
import time
import random
from datetime import datetime, timezone
import paho.mqtt.publish as publish

BROKER = "localhost"
PORT = 1883

WRISTBAND_ID = 1
PATIENT_ID = 1  #for testing purposes

VITALS_TOPIC = f"wristbands/{WRISTBAND_ID}/vitals"
ALERTS_TOPIC = f"health/alerts"

VITALS_INTERVAL_SEC = 20
ALERT_INTERVAL_SEC = 20

last_alert_ts = 0
profile = ["STANDARD",
    "CARDIAC",
    "ELDERLY",
    "RESPIRATORY_RISK",
    "HIGH_RISK"]

while True:
    now_iso = datetime.now(timezone.utc).isoformat()

    # Publish vitals every 5 seconds
    vitals_payload = {
        "wristband_id": WRISTBAND_ID,
        "measured_at": now_iso,
        "heart_rate": random.randint(55, 160),
        "spo2": random.randint(92, 100),
        "temperature": round(random.uniform(35.8, 38.8), 1),
        "motion": round(random.uniform(0.0, 1.5), 2),
        "battery_level": random.randint(20, 100),
        "profile": random.choice(profile)
    }

    publish.single(
        topic=VITALS_TOPIC,
        payload=json.dumps(vitals_payload),
        hostname=BROKER,
        port=PORT
    )
    print("Published VITALS:", VITALS_TOPIC, vitals_payload)
    time.sleep(VITALS_INTERVAL_SEC)

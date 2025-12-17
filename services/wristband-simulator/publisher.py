import json
import time
import paho.mqtt.publish as publish

BROKER = "localhost"
PORT = 1883
TOPIC = "patients/1/vitals"

while True:
    payload = {
        "wristband_id": 1,
        "measured_at": "2025-01-01T12:00:00",
        "heart_rate": 90,
        "spo2": 97,
        "temperature": 36.6,
        "motion": 0.2,
        "battery_level": 80
    }

    publish.single(
        topic=TOPIC,
        payload=json.dumps(payload),  # ✅ JSON واقعی
        hostname=BROKER,
        port=PORT
    )

    print("Published:", payload)
    time.sleep(3)

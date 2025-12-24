import json
import time
import random
from datetime import datetime, timezone
import paho.mqtt.publish as publish

BROKER = "localhost"
PORT = 1883

WRISTBAND_ID = 1
PATIENT_ID = 1  # برای تست فعلاً همین

VITALS_TOPIC = f"wristbands/{WRISTBAND_ID}/vitals"
ALERTS_TOPIC = f"health/alerts"

VITALS_INTERVAL_SEC = 20
ALERT_INTERVAL_SEC = 20

last_alert_ts = 0

while True:
    now_iso = datetime.now(timezone.utc).isoformat()

    # ---- 1) Publish vitals every 5 seconds
    vitals_payload = {
        "wristband_id": WRISTBAND_ID,
        "measured_at": now_iso,
        "heart_rate": random.randint(55, 160),
        "spo2": random.randint(92, 100),
        "temperature": round(random.uniform(35.8, 38.8), 1),
        "motion": round(random.uniform(0.0, 1.5), 2),
        "battery_level": random.randint(20, 100)
    }

    publish.single(
        topic=VITALS_TOPIC,
        payload=json.dumps(vitals_payload),
        hostname=BROKER,
        port=PORT
    )
    print("Published VITALS:", VITALS_TOPIC, vitals_payload)

    # # ---- 2) Publish alert every 30 seconds
    # now_ts = time.time()
    # if now_ts - last_alert_ts >= ALERT_INTERVAL_SEC:
    #     # یک alert نمونه (می‌تونی هرچی خواستی ساده/پیشرفته‌ترش کنی)
    #     alert_payload = {
    #         "patient_id": PATIENT_ID,
    #         "wristband_id": WRISTBAND_ID,
    #         "alert_type": "threshold_exceeded",
    #         "vital": "heart_rate",
    #         "value": vitals_payload["heart_rate"],
    #         "threshold": 120,
    #         "severity": "high" if vitals_payload["heart_rate"] >= 140 else "medium",
    #         "measured_at": now_iso
    #     }

    #     publish.single(
    #         topic=ALERTS_TOPIC,
    #         payload=json.dumps(alert_payload),
    #         hostname=BROKER,
    #         port=PORT
    #     )
    #     print("Published ALERT:", ALERTS_TOPIC, alert_payload)

    #     last_alert_ts = now_ts

    time.sleep(VITALS_INTERVAL_SEC)

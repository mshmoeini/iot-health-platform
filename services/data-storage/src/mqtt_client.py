import json
import os
from datetime import datetime

import paho.mqtt.client as mqtt
from sqlalchemy import text

from storage.local import engine, LocalStorage

storage = LocalStorage()


# =========================================================
# MQTT CALLBACK
# =========================================================
def on_message(client, userdata, msg):
    print(f"[MQTT] message received on {msg.topic}")

    # -------------------------
    # Decode JSON
    # -------------------------
    try:
        payload = json.loads(msg.payload.decode())
    except json.JSONDecodeError:
        print(f"[MQTT] Invalid JSON payload: {msg.payload}")
        return

    # =====================================================
    # ALERTS  → topic: health/alerts
    # =====================================================
    if msg.topic == "health/alerts/#":
        handle_alert(payload)
        return

    # =====================================================
    # VITALS → topic: wristbands/+/vitals
    # =====================================================
    if msg.topic.startswith("wristbands/") and msg.topic.endswith("/vitals"):
        handle_vitals(payload)
        return

    print("[MQTT] Unhandled topic, ignored")


# =========================================================
# HANDLE VITALS
# =========================================================
def handle_vitals(payload: dict):
    wristband_id = payload.get("wristband_id")
    if wristband_id is None:
        print("[VITAL] wristband_id missing, drop message")
        return

    # Resolve active assignment
    with engine.begin() as conn:
        result = conn.execute(
            text(
                """
                SELECT assignment_id
                FROM WRISTBAND_ASSIGNMENT
                WHERE wristband_id = :wid
                  AND end_date IS NULL
                """
            ),
            {"wid": wristband_id},
        ).fetchone()

    if result is None:
        print(f"[VITAL] No active assignment for wristband {wristband_id}")
        return

    assignment_id = result[0]

    storage.save_vital(
        assignment_id=assignment_id,
        data=payload,
    )

    print(f"[VITAL] stored for assignment {assignment_id}")


# =========================================================
# HANDLE ALERTS
# =========================================================
def handle_alert(payload: dict):
    print("[ALERT] received:", payload)

    wristband_id = payload.get("wristband_id")
    patient_id = payload.get("patient_id")

    if wristband_id is None and patient_id is None:
        print("[ALERT] neither wristband_id nor patient_id provided")
        return

    # Resolve active assignment
    with engine.begin() as conn:
        if wristband_id is not None:
            result = conn.execute(
                text(
                    """
                    SELECT assignment_id
                    FROM WRISTBAND_ASSIGNMENT
                    WHERE wristband_id = :wid
                      AND end_date IS NULL
                    """
                ),
                {"wid": wristband_id},
            ).fetchone()
        else:
            result = conn.execute(
                text(
                    """
                    SELECT assignment_id
                    FROM WRISTBAND_ASSIGNMENT
                    WHERE patient_id = :pid
                      AND end_date IS NULL
                    """
                ),
                {"pid": patient_id},
            ).fetchone()

    if result is None:
        print("[ALERT] No active assignment found")
        return

    assignment_id = result[0]

    # Prepare alert payload for DB
    alert_data = {
        "message": payload.get("message", "Alert received"),
        "alert_type": payload.get("alert_type", "GENERIC"),
        "severity": payload.get("severity", "UNKNOWN"),
        "status": payload.get("status", "JUST_GENERATED"),
        "threshold_profile": payload.get("threshold_profile", "STANDARD"),
        "generated_at": payload.get("generated_at"),
    }

    storage.save_alert(
        assignment_id=assignment_id,
        data=alert_data,
    )

    print(f"[ALERT] stored for assignment {assignment_id}")


# =========================================================
# MQTT STARTUP
# =========================================================
def start_mqtt():
    print("[MQTT] start_mqtt called ")

    broker = os.getenv("MQTT_HOST", "mqtt-broker")
    port = int(os.getenv("MQTT_PORT", 1883))

    #print("[MQTT] creating client - STEP 2")
    client = mqtt.Client()

    #print("[MQTT] assigning callback - STEP 3")
    client.on_message = on_message

    #print("[MQTT] connecting - STEP 4")
    client.connect(broker, port)

    #print("[MQTT] subscribing - STEP 5")
    client.subscribe("wristbands/+/vitals")
    client.subscribe("health/alerts")

    print("[MQTT] entering loop_forever")
    client.loop_forever()


import json
import os
import paho.mqtt.client as mqtt
from sqlalchemy import text

from storage.local import engine, LocalStorage

storage = LocalStorage()


def on_message(client, userdata, msg):
    print(f"[MQTT] message received on {msg.topic}")

    # -------------------------
    # Decode JSON (once)
    # -------------------------
    try:
        payload = json.loads(msg.payload.decode())
    except json.JSONDecodeError:
        print(f"[MQTT] Invalid JSON payload: {msg.payload}")
        return

    # -------------------------
    # ALERTS
    # -------------------------
    if msg.topic == "health/alerts":
        print("[ALERT] received:", payload)
        # TODO: insert into ALERT table
        return

    # --- resolve active assignment ---
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
        print(f"[MQTT] No active assignment for wristband {wristband_id}")
        return

    assignment_id = result[0]

    # --- save via ORM storage ---
    storage.save_vital(
        assignment_id=assignment_id,
        data=payload,
    )

    print(f"[VITAL] stored via ORM for assignment {assignment_id}")


def start_mqtt():
    print("[MQTT] start_mqtt called")

    client = mqtt.Client()
    client.on_message = on_message

    broker = os.getenv("MQTT_HOST", "mqtt-broker")
    port = int(os.getenv("MQTT_PORT", 1883))

    print(f"[MQTT] connecting to {broker}:{port}")
    client.connect(broker, port)

    topic = "wristbands/+/vitals"
    client.subscribe(topic)
    client.subscribe("alerts/#")
    print("[MQTT] subscribed to alerts/#")
    print(f"[MQTT] subscribed to {topic}")

    print("[MQTT] subscribed to vitals + alerts")

    client.loop_forever()
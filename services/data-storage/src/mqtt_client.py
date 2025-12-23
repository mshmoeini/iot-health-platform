import json
import os
import paho.mqtt.client as mqtt
from sqlalchemy import text
from storage.local import engine


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

    # -------------------------
    # VITALS
    # -------------------------
    if msg.topic.startswith("patients/") and msg.topic.endswith("/vitals"):
        wristband_id = payload.get("wristband_id")
        if wristband_id is None:
            print("[MQTT] wristband_id missing, drop message")
            return

        with engine.begin() as conn:  # transaction + commit
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

            conn.execute(
                text(
                    """
                    INSERT INTO VITAL_MEASUREMENT (
                        assignment_id,
                        measured_at,
                        heart_rate,
                        spo2,
                        temperature,
                        motion,
                        battery_level
                    )
                    VALUES (
                        :aid, :ts, :hr, :spo2, :temp, :motion, :bat
                    )
                    """
                ),
                {
                    "aid": assignment_id,
                    "ts": payload["measured_at"],
                    "hr": payload.get("heart_rate"),
                    "spo2": payload.get("spo2"),
                    "temp": payload.get("temperature"),
                    "motion": payload.get("motion"),
                    "bat": payload.get("battery_level"),
                },
            )

        print(f"[VITAL] stored for assignment {assignment_id}")
        return

    # -------------------------
    # UNKNOWN TOPIC
    # -------------------------
    print(f"[MQTT] Unhandled topic: {msg.topic}")


def start_mqtt():
    print("[MQTT] start_mqtt called")

    client = mqtt.Client()
    client.on_message = on_message

    broker = os.getenv("MQTT_HOST", "mqtt-broker")
    port = int(os.getenv("MQTT_PORT", 1883))

    print(f"[MQTT] connecting to {broker}:{port}")
    client.connect(broker, port)

    # subscribe to all required topics
    client.subscribe("patients/+/vitals")
    client.subscribe("health/alerts")

    print("[MQTT] subscribed to vitals + alerts")

    client.loop_forever()
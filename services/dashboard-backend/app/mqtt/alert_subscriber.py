import os
import json
import threading
import paho.mqtt.client as mqtt

from app.services.alert_stream import alert_event_stream


MQTT_HOST = os.getenv("MQTT_HOST", "mqtt-broker")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))

# Dashboard Backend listens to ALL alerts
ALERT_TOPIC = "health/alerts/#"


def on_connect(client, userdata, flags, rc):
    print(f"[DASHBOARD-MQTT] connected to broker with rc={rc}")
    client.subscribe(ALERT_TOPIC)
    print(f"[DASHBOARD-MQTT] subscribed to {ALERT_TOPIC}")


def on_message(client, userdata, msg):
    print(f"[DASHBOARD-MQTT] alert received on {msg.topic}")

    # We do NOT parse or store alert payload here
    # DB is the source of truth (Data Storage already saved it)

    # Notify SSE clients that a new alert is available
    alert_event_stream.publish({
        "type": "alert_created"
    })


def start_mqtt_subscriber():
    """
    Starts MQTT client loop in a background thread.
    """
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    print(f"[DASHBOARD-MQTT] connecting to {MQTT_HOST}:{MQTT_PORT}")
    client.connect(MQTT_HOST, MQTT_PORT)

    client.loop_forever()


def start_in_background():
    """
    Run MQTT subscriber in a daemon thread.
    """
    thread = threading.Thread(
        target=start_mqtt_subscriber,
        daemon=True
    )
    thread.start()

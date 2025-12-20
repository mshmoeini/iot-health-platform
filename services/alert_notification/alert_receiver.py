import json
from datetime import datetime
import paho.mqtt.client as mqtt

# MQTT settings
BROKER_HOST = "localhost"
BROKER_PORT = 1883
ALERT_TOPIC = "health/alerts"

# MQTT client
client = mqtt.Client(client_id="alert-notification-service")
client.connect(BROKER_HOST, BROKER_PORT, 60)
client.loop_start()

def send_alert(alert: dict):
    """
    Receive alert dict, enrich it, and publish via MQTT
    """

    # add timestamp
    alert["timestamp"] = datetime.utcnow().isoformat()

    payload = json.dumps(alert)

    # publish alert
    client.publish(ALERT_TOPIC, payload, qos=1)

    print("ALERT PUBLISHED:", payload)

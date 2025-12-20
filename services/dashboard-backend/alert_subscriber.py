import json
import threading
import paho.mqtt.client as mqtt
from datetime import datetime

# ======================
# MQTT CONFIG
# ======================
BROKER_HOST = "localhost"
BROKER_PORT = 1883
ALERT_TOPIC = "health/alerts"

# ======================
# IN-MEMORY ALERT STORE
# ======================
alerts_store = []           # نگه‌داری همه alertها
MAX_ALERTS = 100             # جلوگیری از پر شدن حافظه

store_lock = threading.Lock()

# ======================
# MQTT CALLBACKS
# ======================
def on_connect(client, userdata, flags, rc):
    print("Dashboard Backend connected, rc =", rc)
    client.subscribe(ALERT_TOPIC)

def on_message(client, userdata, msg):
    alert = json.loads(msg.payload.decode())

    alert["received_at"] = datetime.utcnow().isoformat()

    with store_lock:
        alerts_store.append(alert)
        if len(alerts_store) > MAX_ALERTS:
            alerts_store.pop(0)

    print("ALERT RECEIVED IN DASHBOARD BACKEND:", alert)

# ======================
# MQTT CLIENT
# ======================
client = mqtt.Client(client_id="dashboard-backend-service")
client.on_connect = on_connect
client.on_message = on_message

client.connect(BROKER_HOST, BROKER_PORT, 60)
client.loop_forever()

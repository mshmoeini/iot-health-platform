from flask import Flask, jsonify
import json
import paho.mqtt.client as mqtt
from threading import Lock

app = Flask(__name__)

# In-memory storage
alerts_memory = []
memory_lock = Lock()

# MQTT config
BROKER_HOST = "localhost"
BROKER_PORT = 1883
ALERT_TOPIC = "health/alerts"

def on_connect(client, userdata, flags, rc):
    print("Dashboard Backend MQTT connected, rc =", rc)
    client.subscribe(ALERT_TOPIC)

def on_message(client, userdata, msg):
    alert = json.loads(msg.payload.decode())

    with memory_lock:
        alerts_memory.append(alert)

        # limit memory size (optional but logical)
        if len(alerts_memory) > 100:
            alerts_memory.pop(0)

    print("ALERT STORED IN BACKEND:", alert)

# MQTT client
client = mqtt.Client(client_id="dashboard-backend-service")
client.on_connect = on_connect
client.on_message = on_message
client.connect(BROKER_HOST, BROKER_PORT, 60)
client.loop_start()

# REST API
@app.route("/alerts", methods=["GET"])
def get_alerts():
    with memory_lock:
        return jsonify(alerts_memory)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

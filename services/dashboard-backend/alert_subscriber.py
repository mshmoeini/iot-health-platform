import json
import paho.mqtt.client as mqtt

BROKER_HOST = "localhost"
BROKER_PORT = 1883
ALERT_TOPIC = "health/alerts"

def on_connect(client, userdata, flags, rc):
    print("Dashboard Backend connected, rc =", rc)
    client.subscribe(ALERT_TOPIC)

def on_message(client, userdata, msg):
    alert = json.loads(msg.payload.decode())
    print("ALERT RECEIVED IN DASHBOARD BACKEND:", alert)

client = mqtt.Client(client_id="dashboard-backend-service")
client.on_connect = on_connect
client.on_message = on_message

client.connect(BROKER_HOST, BROKER_PORT, 60)
client.loop_forever()

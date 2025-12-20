import json
import paho.mqtt.client as mqtt

BROKER_HOST = "localhost"
BROKER_PORT = 1883
ALERT_TOPIC = "health/alerts"

def on_connect(client, userdata, flags, rc):
    print("Data Storage connected, rc =", rc)
    client.subscribe(ALERT_TOPIC)

def on_message(client, userdata, msg):
    alert = json.loads(msg.payload.decode())
    print("ALERT RECEIVED IN DATA STORAGE:", alert)
    # فعلاً فقط print — ذخیره واقعی بعداً

client = mqtt.Client(client_id="data-storage-service")
client.on_connect = on_connect
client.on_message = on_message

client.connect(BROKER_HOST, BROKER_PORT, 60)
print("Listening for alerts...")
client.loop_forever()

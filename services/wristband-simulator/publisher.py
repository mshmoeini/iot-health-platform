import time
import json
import random
from datetime import datetime
import paho.mqtt.client as mqtt

BROKER_HOST = "localhost"
BROKER_PORT = 1883
TOPIC = "health/vitals"

def on_connect(client, userdata, flags, rc):
    print("on_connect called, rc =", rc)

client = mqtt.Client(
    client_id="wristband-simulator",
    protocol=mqtt.MQTTv311   # 👈 خیلی مهم
)

client.on_connect = on_connect

print("Connecting to broker...")
client.connect(BROKER_HOST, BROKER_PORT, 60)

# 👇 مهم: loop_forever به‌جای loop_start
client.loop_start()

time.sleep(2)  # 👈 فقط همین، بدون while

print("Start publishing...")

while True:
    data = {
        "patient_id": "P001",
        "timestamp": datetime.utcnow().isoformat(),
        "heart_rate": random.randint(60, 110),
        "spo2": random.randint(92, 100),
        "temperature": round(random.uniform(36.0, 38.5), 1)
    }

    payload = json.dumps(data)
    client.publish(TOPIC, payload, qos=1)
    print("Published:", payload)

    time.sleep(3)

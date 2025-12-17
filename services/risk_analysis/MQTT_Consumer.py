import json
import paho.mqtt.client as mqtt
from services.risk_analysis.Threshold_check import process_hr_value

BROKER_HOST = "localhost"
BROKER_PORT = 1883
TOPIC = "health/vitals"

def on_message(client, userdata, msg):
    data = json.loads(msg.payload.decode())
    hr = data["heart_rate"]
    process_hr_value(hr)

client = mqtt.Client()
client.connect(BROKER_HOST, BROKER_PORT, 60)
client.subscribe(TOPIC)
client.on_message = on_message

print("Risk analysis listening to MQTT...")
client.loop_forever()

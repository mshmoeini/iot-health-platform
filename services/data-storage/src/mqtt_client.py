import json
import paho.mqtt.client as mqtt
from storage.local import LocalStorage

storage = LocalStorage()

def on_message(client, userdata, msg):
    payload = json.loads(msg.payload.decode())
    patient_id = payload["patient_id"]
    storage.save_vital(patient_id, payload)

client = mqtt.Client()
client.connect("mqtt-broker", 1883)
client.subscribe("patients/+/vitals")
client.on_message = on_message

client.loop_forever()

import os
import paho.mqtt.client as mqtt

MQTT_HOST = os.getenv("MQTT_HOST", "mqtt-broker")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))
ALERT_TOPIC = "health/alerts"


def on_connect(client, userdata, flags, rc):
    print(f"[ALERT] connected to broker with rc={rc}")
    client.subscribe(ALERT_TOPIC)
    print(f"[ALERT] subscribed to {ALERT_TOPIC}")

def on_message(client, userdata, msg):
    print(f"[ALERT] message received on {msg.topic}")
    print(f"[ALERT] payload: {msg.payload.decode()}")


def main():
    print("[ALERT] service starting")

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    print(f"[ALERT] connecting to {MQTT_HOST}:{MQTT_PORT}")
    client.connect(MQTT_HOST, MQTT_PORT)

    client.loop_forever()


if __name__ == "__main__":
    main()

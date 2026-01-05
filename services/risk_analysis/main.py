import json
import os
import paho.mqtt.client as mqtt # type: ignore


MQTT_HOST = os.getenv("MQTT_HOST", "mqtt-broker")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))

VITALS_TOPIC = "wristbands/+/vitals"
RISK_TOPIC = "health/risk/{wristband_id}"

HR_WARNING = 100
HR_CRITICAL = 120


def evaluate_hr(hr):
    if hr >= HR_CRITICAL:
        return "CRITICAL"
    elif hr >= HR_WARNING:
        return "WARNING"
    return "NORMAL"


def on_connect(client, userdata, flags, rc):
    print(f"[RISK] connected to broker with rc={rc}")
    client.subscribe(VITALS_TOPIC)
    print(f"[RISK] subscribed to {VITALS_TOPIC}")


def on_message(client, userdata, msg):
    print(f"[RISK] message received on {msg.topic}")

    try:
        payload = json.loads(msg.payload.decode())
    except json.JSONDecodeError:
        print("[RISK] invalid JSON payload")
        return

    hr = payload.get("heart_rate")
    wristband_id = payload.get("wristband_id")
    if hr is None:
        print("[RISK] heart_rate missing")
        return

    severity = evaluate_hr(hr)
    if severity == "NORMAL":
        print(f"[RISK] HR={hr} NORMAL")
        return

    alert = {
        "wristband_id": wristband_id,
        "alert_type": "HR",
        "value": hr,
        "severity": severity,
        "title": f"HR Alert: {severity}",
        "description": f"Heart rate is {hr} bpm, which is considered {severity}.",
        "full description": f"The heart rate recorded from wristband {wristband_id} is {hr} bpm. Immediate attention may be required.",
        "heart_rate": hr,
        "spo2": payload.get("spo2"),
        "temperature": payload.get("temperature"),
    }

    client.publish(RISK_TOPIC, json.dumps(alert))
    print(f"[RISK] alert published: {alert}")


def main():
    print("[RISK] main() started")

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    print(f"[RISK] connecting to {MQTT_HOST}:{MQTT_PORT}")
    client.connect(MQTT_HOST, MQTT_PORT)

    client.loop_forever()


if __name__ == "__main__":
    main()





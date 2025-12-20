from datetime import datetime
import json

def send_alert(alert):
    alert["timestamp"] = datetime.utcnow().isoformat()

    print("ALERT RECEIVED:", alert)

    with open("alerts.log", "a") as f:
        f.write(json.dumps(alert) + "\n")

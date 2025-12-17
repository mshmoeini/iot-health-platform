import json
from pathlib import Path
from services.alert_notification.alert_receiver import send_alert

# مسیر thresholds.json
BASE_DIR = Path(__file__).resolve().parent.parent
threshold_path = BASE_DIR / "health-catalog" / "config" / "thresholds.json"

with open(threshold_path) as f:
    thresholds = json.load(f)

hr_limits = thresholds["global"]["hr"]

# 👇 اول تعریف تابع
def evaluate_hr(value, limits):
    if limits["critical"][0] is not None and value >= limits["critical"][0]:
        return "CRITICAL"
    elif limits["warning"][0] is not None and value >= limits["warning"][0]:
        return "WARNING"
    else:
        return "NORMAL"
def create_alert(metric, value, status):
    return {
        "metric": metric,
        "value": value,
        "status": status
    }

def process_hr_value(hr_value):
    status = evaluate_hr(hr_value, hr_limits)
    if status != "NORMAL":
        alert = create_alert("HR", hr_value, status)
        send_alert(alert)

    return status
# 👇 بعد اجرای تست
if __name__ == "__main__":
    process_hr_value(105)
    process_hr_value(130)

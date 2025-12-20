from datetime import datetime

PATIENTS = [
    {"patient_id": 1, "name": "Patient One"},
    {"patient_id": 2, "name": "Patient Two"},
]

VITALS = {
    1: {
        "patient_id": 1,
        "heart_rate": 92,
        "spo2": 97,
        "temperature": 36.7,
        "timestamp": datetime.utcnow()
    }
}

ALERTS = [
    {
        "patient_id": 1,
        "level": "WARNING",
        "message": "Heart rate slightly elevated",
        "timestamp": datetime.utcnow()
    }
]

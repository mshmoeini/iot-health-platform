from typing import List, Dict
from app.services.storage import Storage


def get_latest_vitals_ui(storage: Storage) -> Dict:
    """
    Return latest vitals for all active patients (UI-ready).
    """
    rows = storage.get_latest_vitals()

    items: List[Dict] = []

    for row in rows:
        items.append({
            "patient_id": row["patient_id"],
            "patient_name": row.get("patient_name"),
            "device_id": f"WB-{row['wristband_id']}",
            "measured_at": row["measured_at"],

            "vitals": {
                "heart_rate": row.get("heart_rate"),
                "spo2": row.get("spo2"),
                "temperature": row.get("temperature"),
                "motion": row.get("motion"),
                "battery_level": row.get("battery_level"),
            }
        })

    return {"items": items}


def get_vitals_history_ui(
    storage: Storage,
    patient_id: int,
    limit: int = 50,
) -> Dict:
    """
    Return vitals history for a patient.
    """
    rows = storage.get_vitals_history(patient_id, limit)

    return {
        "patient_id": patient_id,
        "items": rows,
    }

from typing import Dict, List, Optional

from app.services.storage import Storage


# --------------------------------------------------
# Constants / Enums (UI-facing)
# --------------------------------------------------

RISK_NORMAL = "NORMAL"
RISK_WARNING = "WARNING"
RISK_CRITICAL = "CRITICAL"


# --------------------------------------------------
# Helper functions
# --------------------------------------------------

def _map_wristband_to_device_id(wristband_id: Optional[int]) -> Optional[str]:
    """
    Convert internal wristband_id to UI-friendly device_id.

    تبدیل wristband_id داخلی به device_id قابل نمایش در UI
    """
    if wristband_id is None:
        return None
    return f"WB-{wristband_id}"


def _compute_risk_status(latest_alert_severity: Optional[str]) -> str:
    """
    Compute patient risk status based on latest active alert severity.

    منطق:
    - اگر alert فعال وجود نداشته باشد → NORMAL
    - اگر آخرین alert CRITICAL باشد → CRITICAL
    - اگر WARNING باشد → WARNING
    """

    if latest_alert_severity == RISK_CRITICAL:
        return RISK_CRITICAL

    if latest_alert_severity == RISK_WARNING:
        return RISK_WARNING

    return RISK_NORMAL


# --------------------------------------------------
# Main service function
# --------------------------------------------------

def get_patients_overview(storage: Storage) -> Dict:
    """
    Build UI-ready patients list for Patients page.

    این تابع:
    - دیتای خام را از storage می‌گیرد
    - منطق بیزنسی (risk status و mapping) را اعمال می‌کند
    - خروجی نهایی مناسب UI می‌سازد
    """

    rows = storage.get_patients_overview()
    items: List[Dict] = []

    for row in rows:
        wristband_id = row.get("wristband_id")
        latest_alert_severity = row.get("latest_alert_severity")

        risk_status = _compute_risk_status(latest_alert_severity)

        has_active_alert = latest_alert_severity is not None

        item = {
            # -------------------------
            # Patient identity
            # -------------------------
            "patient_id": row["patient_id"],
            "name": row["patient_name"],
            "age": row.get("age"),
            "gender": row.get("gender"),
            "phone": row.get("phone"),

            # -------------------------
            # Device info
            # -------------------------
            "device_id": _map_wristband_to_device_id(wristband_id),
            "device_status": "ACTIVE" if wristband_id else "INACTIVE",

            # -------------------------
            # Latest vitals (may be None)
            # -------------------------
            "vitals": {
                "heart_rate": row.get("heart_rate"),
                "spo2": row.get("spo2"),
                "temperature": row.get("temperature"),
                "battery_level": row.get("battery_level"),
            } if wristband_id else None,

            # -------------------------
            # Status & metadata
            # -------------------------
            "risk_status": risk_status,
            "has_active_alert": has_active_alert,
            "last_update": row.get("last_update"),
        }

        items.append(item)

    return {"items": items}


def get_patient_alerts(storage: Storage, patient_id: int) -> dict:
    """
    Build UI-ready alerts list for a single patient.
    """
    rows = storage.get_patient_alerts(patient_id)
    items = []

    for row in rows:
        wristband_id = row.get("wristband_id")

        items.append({
            "alert_id": row["alert_id"],
            "severity": row["severity"],
            "status": row["status"],
            "alert_type": row["alert_type"],
            "description": row["message"],
            "device_id": f"WB-{wristband_id}" if wristband_id else None,
            "generated_at": row["generated_at"],
        })

    return {"items": items}


def create_patient(storage: Storage, payload: dict) -> dict:
    """
    Create patient and optionally assign a wristband.
    """

    wristband_id = payload.pop("wristband_id", None)

    # 1. Create patient
    patient = storage.create_patient(payload)
    patient_id = patient["patient_id"]

    # 2. Assign wristband if provided
    if wristband_id is not None:
        storage.assign_wristband(
            patient_id=patient_id,
            wristband_id=wristband_id,
        )

    return patient

def get_patient_detail(storage: Storage, patient_id: int) -> dict:
    """
    Build UI-ready patient detail response.
    """
    row = storage.get_patient_overview(patient_id)

    if row is None:
        raise ValueError("Patient not found")

    wristband_id = row.get("wristband_id")
    latest_alert_severity = row.get("latest_alert_severity")

    risk_status = _compute_risk_status(latest_alert_severity)

    return {
        "patient_id": row["patient_id"],
        "name": row["patient_name"],
        "age": row.get("age"),
        "gender": row.get("gender"),
        "phone": row.get("phone"),

        "device_id": f"WB-{wristband_id}" if wristband_id else None,
        "device_status": "ACTIVE" if wristband_id else "INACTIVE",

        "vitals": {
            "heart_rate": row.get("heart_rate"),
            "spo2": row.get("spo2"),
            "temperature": row.get("temperature"),
            "battery_level": row.get("battery_level"),
        } if wristband_id else None,

        "risk_status": risk_status,
        "has_active_alert": latest_alert_severity is not None,
        "last_update": row.get("last_update"),
    }

import os
import requests

from app.services.storage import Storage


DATA_STORAGE_BASE_URL = os.getenv(
    "DATA_STORAGE_URL",
    "http://data-storage:8003"
)


class RESTDataStorageClient(Storage):
    """
    REST-based implementation of Storage interface.

    Communicates with Data Storage Service over HTTP.
    """

    # ---------------- Alerts ----------------

    def list_alerts(self):
        r = requests.get(f"{DATA_STORAGE_BASE_URL}/alerts")
        r.raise_for_status()
        return r.json()["items"]

    def acknowledge_alert(self, alert_id, reviewed_by=None, clinical_note=None):
        payload = {
            "reviewed_by": reviewed_by,
            "clinical_note": clinical_note,
        }
        r = requests.post(
            f"{DATA_STORAGE_BASE_URL}/alerts/{alert_id}/acknowledge",
            json=payload,
        )
        r.raise_for_status()

    def get_patient_alerts(self, patient_id):
        r = requests.get(
            f"{DATA_STORAGE_BASE_URL}/patients/{patient_id}/alerts"
        )
        r.raise_for_status()
        return r.json()["items"]

    # ---------------- Patients ----------------

    def get_patients(self):
        r = requests.get(f"{DATA_STORAGE_BASE_URL}/patients")
        r.raise_for_status()
        return r.json()["items"]

    def get_patient_overview(self, patient_id):
        r = requests.get(
            f"{DATA_STORAGE_BASE_URL}/patients/{patient_id}"
        )
        if r.status_code == 404:
            return None
        r.raise_for_status()
        return r.json()

    def create_patient(self, data):
        r = requests.post(f"{DATA_STORAGE_BASE_URL}/patients", json=data)
        r.raise_for_status()
        return r.json()

    def assign_wristband(self, patient_id, wristband_id):
        r = requests.post(
            f"{DATA_STORAGE_BASE_URL}/patients/{patient_id}/assign",
            json={"wristband_id": wristband_id},
        )
        r.raise_for_status()

    # ---------------- Vitals ----------------

    def get_latest_vitals(self):
        r = requests.get(f"{DATA_STORAGE_BASE_URL}/vitals/latest")
        r.raise_for_status()
        return r.json()["items"]

    def get_vitals_history(self, patient_id, limit=50):
        r = requests.get(
            f"{DATA_STORAGE_BASE_URL}/vitals/{patient_id}",
            params={"limit": limit},
        )
        r.raise_for_status()
        return r.json()["items"]

    def count_low_battery_devices(self, threshold):
        r = requests.get(
            f"{DATA_STORAGE_BASE_URL}/devices/low-battery",
            params={"threshold": threshold},
        )
        r.raise_for_status()
        return r.json()["count"]

    # ---------------- Wristbands ----------------

    def list_wristbands(self):
        r = requests.get(f"{DATA_STORAGE_BASE_URL}/wristbands")
        r.raise_for_status()
        return r.json()["items"]

    def list_available_wristbands(self):
        r = requests.get(f"{DATA_STORAGE_BASE_URL}/wristbands/available")
        r.raise_for_status()
        return r.json()["items"]

    def create_wristband(self, wristband_id):
        r = requests.post(
            f"{DATA_STORAGE_BASE_URL}/wristbands",
            json={"wristband_id": wristband_id},
        )
        r.raise_for_status()
        return r.json()

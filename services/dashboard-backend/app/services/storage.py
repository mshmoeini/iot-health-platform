# app/services/storage.py

from abc import ABC, abstractmethod
from typing import List, Dict, Optional


class Storage(ABC):
    """
    Abstract storage interface.

    All methods return raw dictionaries coming from the database layer.
    Joins required to ensure medical correctness (assignment context)
    MUST be handled here or in the concrete storage implementation.

    این اینترفیس قرارداد رسمی بین service layer و دیتابیس است.
    تمام داده‌ها باید در context صحیح assignment برگردانده شوند.
    """

    # ==================================================
    # Alerts
    # ==================================================

    @abstractmethod
    def list_alerts(self) -> List[Dict]:
        """
        Return all alerts enriched with:
        - patient name
        - wristband id (device)
        - assignment context

        خروجی باید شامل اطلاعات بیمار و دستگاه باشد.
        """
        pass

    @abstractmethod
    def acknowledge_alert(
        self,
        alert_id: int,
        reviewed_by: Optional[str] = None,
        clinical_note: Optional[str] = None,
    ) -> None:
        """
        Acknowledge an alert and update its status and review metadata.

        وضعیت هشدار را به ACKNOWLEDGED تغییر می‌دهد
        و اطلاعات بازبینی را ذخیره می‌کند.
        """
        pass

    # ==================================================
    # Patients
    # ==================================================

    @abstractmethod
    def get_patients(self) -> List[Dict]:
        """
        Return all patients with their active device assignment (if any).

        هر بیمار به‌همراه دستگاه فعال فعلی (در صورت وجود).
        """
        pass

    # ==================================================
    # Vitals
    # ==================================================

    @abstractmethod
    def get_latest_vitals(self) -> List[Dict]:
        """
        Return the latest vital measurement for each ACTIVE assignment.

        - Only assignments with end_date IS NULL
        - One latest measurement per assignment
        - Enriched with patient name and wristband id

        آخرین vitals هر بیمار فعال.
        """
        pass

    @abstractmethod
    def get_vitals_history(
        self,
        assignment_id: int,
        limit: int = 50
    ) -> List[Dict]:
        """
        Return vitals history for a specific assignment.

        This guarantees that vitals belong to the same patient-device
        relationship over time.

        تاریخچه vitals برای یک assignment مشخص (امن از نظر پزشکی).
        """
        pass

    @abstractmethod
    def count_low_battery_devices(self, threshold: int) -> int:
        """
        Count active assignments whose latest battery level
        is below the given threshold.

        تعداد دستگاه‌های فعال با باتری کمتر از threshold.
        """
        pass

    def get_patient_alerts(self, patient_id: int) -> list[dict]:
        """
        Return all alerts for a given patient.
        """
        raise NotImplementedError
    


    def create_patient(self, data: dict) -> dict:
        """
        Create a new patient and return the created record.
        """
        raise NotImplementedError

    def assign_wristband(
        self,
        patient_id: int,
        wristband_id: int,
    ) -> None:
        """
        Assign a wristband to a patient (create WRISTBAND_ASSIGNMENT).
        """
        raise NotImplementedError

    def create_wristband(self, wristband_id: int) -> Dict:
        """
        Create a new wristband in DB.
        ساخت یک دستبند جدید در دیتابیس
        """
        raise NotImplementedError

    def get_patient_overview(self, patient_id: int) -> dict | None:
        """
        Return overview data for a single patient.
        """
        raise NotImplementedError


    def list_wristbands(self) -> list[dict]:
        """
        Return all wristbands.
        """
        raise NotImplementedError


    def list_available_wristbands(self) -> list[dict]:
        """
        Return wristbands without an active assignment.
        """
        raise NotImplementedError
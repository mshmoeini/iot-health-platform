
# app/services/storage.py
from abc import ABC, abstractmethod
from typing import List, Dict, Optional


class Storage(ABC):

    @abstractmethod
    def list_alerts(self) -> List[Dict]:
        pass

    @abstractmethod
    def acknowledge_alert(
        self,
        alert_id: int,
        reviewed_by: Optional[str] = None,
        clinical_note: Optional[str] = None,
    ) -> None:
        pass

    @abstractmethod
    def get_patients(self) -> List[Dict]:
        pass

    @abstractmethod
    def get_latest_vitals(self, patient_id: int) -> Optional[Dict]:
        pass

    @abstractmethod
    def get_vitals_history(
        self,
        patient_id: int,
        limit: int = 50
    ) -> List[Dict]:
        pass

from abc import ABC, abstractmethod

class StorageBackend(ABC):

    @abstractmethod
    def save_vital(self, patient_id: int, data: dict):
        pass

    @abstractmethod
    def get_latest(self, patient_id: int):
        pass

    @abstractmethod
    def get_history(self, patient_id: int, start=None, end=None):
        pass

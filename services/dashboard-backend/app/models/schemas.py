from pydantic import BaseModel
from typing import List
from datetime import datetime


class Patient(BaseModel):
    patient_id: int
    name: str


class Vital(BaseModel):
    patient_id: int
    heart_rate: int
    spo2: int
    temperature: float
    timestamp: datetime


class Alert(BaseModel):
    patient_id: int
    level: str
    message: str
    timestamp: datetime

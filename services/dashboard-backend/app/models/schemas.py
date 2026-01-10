from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


# -------------------------
# Core / Shared Schemas
# -------------------------

class PatientOut(BaseModel):
    patient_id: int
    name: str


class VitalOut(BaseModel):
    
    patient_id: int
    heart_rate: int = Field(..., ge=0)
    spo2: int = Field(..., ge=0, le=100)
    temperature: float
    measured_at: datetime


# -------------------------
# Alerts (Domain Contract)
# -------------------------

class AlertSeverity(str, Enum):
    INFO = "INFO"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"


class AlertStatus(str, Enum):
    JUST_GENERATED = "JUST_GENERATED"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    # optional/future:
    # RESOLVED = "RESOLVED"


class AlertAckRequest(BaseModel):
  
    reviewed_by: Optional[str] = None
    clinical_note: Optional[str] = None


class AlertListItem(BaseModel):
    
    alert_id: int
    severity: AlertSeverity
    status: AlertStatus

    alert_type: str
    description: str

    device_id: str

    generated_at: datetime
    acknowledged: bool = Field(..., description="True if status == ACKNOWLEDGED")


# -------------------------
# Dashboard Overview (Final Contract)
# -------------------------

class SystemOverviewSchema(BaseModel):
    active_devices: int = Field(..., ge=0)
    patients_monitored: int = Field(..., ge=0)
    active_alerts: int = Field(..., ge=0)
    last_update: datetime


class DashboardStatsSchema(BaseModel):
    patients_in_risk: int = Field(..., ge=0)
    low_battery_devices: int = Field(..., ge=0)


class RecentAlertSchema(BaseModel):
    alert_id: int
    severity: AlertSeverity
    alert_type: str
    description: str
    device_id: str
    generated_at: datetime
    acknowledged: bool


class DashboardOverviewResponse(BaseModel):
    system_overview: SystemOverviewSchema
    stats: DashboardStatsSchema
    recent_alerts: List[RecentAlertSchema]

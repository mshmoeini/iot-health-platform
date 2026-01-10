from datetime import datetime, timezone
from typing import Dict, List

from app.services.storage import Storage
from app.models.schemas import (
    DashboardOverviewResponse,
    SystemOverviewSchema,
    DashboardStatsSchema,
    RecentAlertSchema,
    AlertStatus,
    AlertSeverity,
)


LOW_BATTERY_THRESHOLD = 30          # percentage
RECENT_ALERTS_LIMIT = 5             # max alerts shown on dashboard
RISK_SEVERITIES = {
    AlertSeverity.CRITICAL,
    AlertSeverity.WARNING,
}


def get_dashboard_overview(storage: Storage) -> DashboardOverviewResponse:
    """
    Build and return aggregated data for the Dashboard Overview page.

    Responsibilities:
    - Aggregate system-wide counters (devices, patients, alerts)
    - Compute risk-related statistics
    - Detect low-battery devices
    - Build UI-ready recent alerts preview

    This function contains NO SQL and NO FastAPI logic.
    """

    now = datetime.now(timezone.utc)

    # --------------------------------------------------
    # 1. Fetch base data from storage
    # --------------------------------------------------

    patients = storage.get_patients()
    alerts = storage.list_alerts_with_wristband()


    # --------------------------------------------------
    # 2. System overview counters
    # --------------------------------------------------

    patients_monitored = len(patients)

    active_alerts = [
        alert for alert in alerts
        if alert.get("status") != AlertStatus.ACKNOWLEDGED
    ]

    system_overview = SystemOverviewSchema(
        active_devices=_count_active_devices(storage),
        patients_monitored=patients_monitored,
        active_alerts=len(active_alerts),
        last_update=now,
    )

    # --------------------------------------------------
    # 3. Risk statistics
    # --------------------------------------------------

    patients_in_risk = _count_patients_in_risk(alerts)

    low_battery_devices = _count_low_battery_devices(storage)

    stats = DashboardStatsSchema(
        patients_in_risk=patients_in_risk,
        low_battery_devices=low_battery_devices,
    )

    # --------------------------------------------------
    # 4. Recent alerts preview (UI-ready)
    # --------------------------------------------------

    recent_alerts = _build_recent_alerts(alerts)

    return DashboardOverviewResponse(
        system_overview=system_overview,
        stats=stats,
        recent_alerts=recent_alerts,
    )


# ======================================================
# Helper functions (internal logic)
# ======================================================

def _count_active_devices(storage: Storage) -> int:
    """
    Count active devices.

    Definition:
    - Devices with an active assignment
    - Devices that recently sent valid vitals

    NOTE:
    This logic can evolve without impacting API consumers.
    """
    # Simplest version: number of patients with active assignments
    # Can be refined later if device table is introduced
    patients = storage.get_patients()
    return len(patients)


def _count_patients_in_risk(alerts: List[Dict]) -> int:
    """
    Count unique patients that currently require attention.

    A patient is considered 'in risk' if:
    - At least one unacknowledged alert exists
    - Alert severity is WARNING or CRITICAL
    """

    risky_patients = set()

    for alert in alerts:
        if (
            alert.get("status") != AlertStatus.ACKNOWLEDGED
            and alert.get("severity") in RISK_SEVERITIES
        ):
            patient_id = alert.get("patient_id")
            if patient_id is not None:
                risky_patients.add(patient_id)

    return len(risky_patients)


def _count_low_battery_devices(storage: Storage) -> int:
    """
    Count devices whose latest battery level is below the defined threshold.

    Battery level is extracted from the latest vitals of each patient/device.
    """

    count = 0
    patients = storage.get_patients()

    for patient in patients:
        vitals = storage.get_latest_vitals(patient["patient_id"])
        if not vitals:
            continue

        battery_level = vitals.get("battery_level")
        if battery_level is not None and battery_level < LOW_BATTERY_THRESHOLD:
            count += 1

    return count


def _build_recent_alerts(alerts: List[Dict]) -> List[RecentAlertSchema]:
    """
    Build a limited, UI-friendly list of recent alerts.

    Rules:
    - Only unacknowledged alerts
    - Sorted by generated_at DESC
    - Limited to RECENT_ALERTS_LIMIT
    """

    unacknowledged_alerts = [
        alert for alert in alerts
        if alert.get("status") != AlertStatus.ACKNOWLEDGED
    ]

    # Sort newest first
    unacknowledged_alerts.sort(
        key=lambda a: a.get("generated_at"),
        reverse=True,
    )

    recent_alerts: List[RecentAlertSchema] = []

    for alert in unacknowledged_alerts[:RECENT_ALERTS_LIMIT]:
        wristband_id = alert.get("wristband_id")

        recent_alerts.append(
            RecentAlertSchema(
                alert_id=alert["alert_id"],
                severity=alert["severity"],
                alert_type=alert.get("alert_type", "Unknown"),
                description=alert.get("description", ""),
                device_id=_map_wristband_to_device_id(wristband_id),
                generated_at=alert["generated_at"],
                acknowledged=alert.get("status") == AlertStatus.ACKNOWLEDGED,
            )
        )

    return recent_alerts


def _map_wristband_to_device_id(wristband_id: int | None) -> str:
    """
    Map internal wristband_id to a UI-friendly device_id string.
    """
    if wristband_id is None:
        return "UNKNOWN"
    return f"WB-{wristband_id}"

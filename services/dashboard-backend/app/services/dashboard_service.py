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

# --------------------------------------------------
# Constants
# --------------------------------------------------

LOW_BATTERY_THRESHOLD = 30      # Battery percentage threshold
RECENT_ALERTS_LIMIT = 5         # Max alerts shown on dashboard

RISK_SEVERITIES = {
    AlertSeverity.CRITICAL,
    AlertSeverity.WARNING,
}


# ======================================================
# Main service function
# ======================================================

def get_dashboard_overview(storage: Storage) -> DashboardOverviewResponse:
    """
    Build and return aggregated data for the Dashboard Overview page.

    این تابع داده‌های موردنیاز داشبورد را تجمیع می‌کند
    و هیچ دانشی از SQL یا FastAPI ندارد.
    """

    now = datetime.now(timezone.utc)

    # --------------------------------------------------
    # 1. Fetch base data from storage
    # --------------------------------------------------

    patients = storage.get_patients()
    alerts = storage.list_alerts()

    # --------------------------------------------------
    # 2. System overview section
    # --------------------------------------------------

    system_overview = SystemOverviewSchema(
        active_devices=_count_active_devices(patients),
        patients_monitored=len(patients),
        active_alerts=_count_active_alerts(alerts),
        last_update=now,
    )

    # --------------------------------------------------
    # 3. Dashboard statistics
    # --------------------------------------------------

    stats = DashboardStatsSchema(
        patients_in_risk=_count_patients_in_risk(alerts),
        low_battery_devices=storage.count_low_battery_devices(
            LOW_BATTERY_THRESHOLD
        ),
    )

    # --------------------------------------------------
    # 4. Recent alerts preview
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

def _count_active_devices(patients: List[Dict]) -> int:
    """
    Count active devices.

    Definition:
    - Each patient with an active wristband assignment
      is considered one active device.

    شمارش دستگاه‌های فعال (assignment فعال).
    """
    return len([
        p for p in patients
        if p.get("wristband_id") is not None
    ])


def _count_active_alerts(alerts: List[Dict]) -> int:
    """
    Count unacknowledged alerts.

    شمارش هشدارهایی که هنوز acknowledge نشده‌اند.
    """
    return len([
        a for a in alerts
        if a.get("status") != AlertStatus.ACKNOWLEDGED
    ])


def _count_patients_in_risk(alerts: List[Dict]) -> int:
    """
    Count unique patients that currently have
    unacknowledged WARNING or CRITICAL alerts.

    شمارش بیماران منحصربه‌فرد در وضعیت ریسک.
    """
    risky_patients = set()

    for alert in alerts:
        if (
            alert.get("status") != AlertStatus.ACKNOWLEDGED
            and alert.get("severity") in RISK_SEVERITIES
        ):
            patient_name = alert.get("patient_name")
            if patient_name:
                risky_patients.add(patient_name)

    return len(risky_patients)


def _build_recent_alerts(alerts: List[Dict]) -> List[RecentAlertSchema]:
    """
    Build a limited, UI-friendly list of recent alerts.

    Rules:
    - Only unacknowledged alerts
    - Sorted by generated_at DESC
    - Limited to RECENT_ALERTS_LIMIT

    ساخت لیست هشدارهای اخیر برای نمایش در داشبورد.
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
        recent_alerts.append(
            RecentAlertSchema(
                alert_id=alert["alert_id"],
                severity=alert["severity"],
                alert_type=alert.get("alert_type", "Unknown"),
                description=alert.get("message", ""),
                device_id=_map_wristband_to_device_id(
                    alert.get("wristband_id")
                ),
                generated_at=alert["generated_at"],
                acknowledged=False,
                patient_name=alert.get("patient_name"),
            )
        )

    return recent_alerts


def _map_wristband_to_device_id(wristband_id: int | None) -> str:
    """
    Map internal wristband_id to a UI-friendly device_id.

    تبدیل wristband_id داخلی به device_id قابل نمایش در UI.
    """
    if wristband_id is None:
        return "UNKNOWN"
    return f"WB-{wristband_id}"

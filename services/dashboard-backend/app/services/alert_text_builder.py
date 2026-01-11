def build_full_description(alert: dict) -> str:
    patient = alert.get("patient_name", "The patient")
    alert_type = alert.get("alert_type", "an alert")
    severity = alert.get("severity", "").lower()

    return (
        f"Patient {patient} has a {severity} {alert_type} alert "
        f"that requires attention."
    )

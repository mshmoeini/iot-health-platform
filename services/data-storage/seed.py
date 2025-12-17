from datetime import datetime
from sqlalchemy import create_engine, text
import os

DB_PATH = os.getenv("DB_PATH", "/app/data/health.db")
engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})

with engine.begin() as conn:
    # wristband
    conn.execute(text("""
        INSERT OR IGNORE INTO WRISTBAND(wristband_id, production_date)
        VALUES (1, :pd)
    """), {"pd": datetime.utcnow().isoformat()})

    # patient
    conn.execute(text("""
        INSERT OR IGNORE INTO PATIENT(patient_id, name, threshold_profile)
        VALUES (1, 'Test Patient', 'STANDARD')
    """))

    # assignment (active)
    conn.execute(text("""
        INSERT INTO WRISTBAND_ASSIGNMENT(wristband_id, patient_id, start_date, end_date)
        SELECT 1, 1, :sd, NULL
        WHERE NOT EXISTS (
            SELECT 1 FROM WRISTBAND_ASSIGNMENT WHERE wristband_id=1 AND end_date IS NULL
        )
    """), {"sd": datetime.utcnow().isoformat()})

print("✅ Seed completed.")

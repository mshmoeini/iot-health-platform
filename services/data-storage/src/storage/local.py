from sqlalchemy import create_engine, Table, Column, Integer, Float, MetaData, DateTime
from datetime import datetime
import os

DB_PATH = os.getenv("DB_PATH", "/app/data/health.db")
engine = create_engine(
    f"sqlite:///{DB_PATH}",
    connect_args={"check_same_thread": False}
)
metadata = MetaData()

vitals = Table(
    "vitals",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("patient_id", Integer),
    Column("hr", Float),
    Column("spo2", Float),
    Column("temp", Float),
    Column("timestamp", DateTime, default=datetime.utcnow)
)

metadata.create_all(engine)

class LocalStorage:
    def save_vital(self, patient_id, data):
        with engine.connect() as conn:
            conn.execute(vitals.insert().values(
                patient_id=patient_id,
                hr=data["hr"],
                spo2=data["spo2"],
                temp=data["temp"]
            ))

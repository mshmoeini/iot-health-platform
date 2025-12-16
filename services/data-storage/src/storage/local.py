from sqlalchemy import create_engine, Table, Column, Integer, Float, MetaData, DateTime
from datetime import datetime

engine = create_engine("sqlite:///data/health.db")
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

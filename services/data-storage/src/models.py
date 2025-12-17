from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Float,
    ForeignKey,
    CheckConstraint,
)
from storage.base import Base
from datetime import datetime


class Wristband(Base):
    __tablename__ = "WRISTBAND"

    wristband_id = Column(Integer, primary_key=True)
    production_date = Column(DateTime, nullable=False, default=datetime.utcnow)


class Patient(Base):
    __tablename__ = "PATIENT"

    patient_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    threshold_profile = Column(
        String(30),
        CheckConstraint(
            "threshold_profile IN "
            "('STANDARD','CARDIAC','ELDERLY','RESPIRATORY_RISK','HIGH_RISK')"
        ),
        nullable=False,
    )


class WristbandAssignment(Base):
    __tablename__ = "WRISTBAND_ASSIGNMENT"

    assignment_id = Column(Integer, primary_key=True, autoincrement=True)
    wristband_id = Column(Integer, ForeignKey("WRISTBAND.wristband_id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("PATIENT.patient_id"), nullable=False)
    start_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    end_date = Column(DateTime)


class VitalMeasurement(Base):
    __tablename__ = "VITAL_MEASUREMENT"

    measurement_id = Column(Integer, primary_key=True, autoincrement=True)
    assignment_id = Column(
        Integer,
        ForeignKey("WRISTBAND_ASSIGNMENT.assignment_id"),
        nullable=False,
    )
    measured_at = Column(DateTime, nullable=False)

    heart_rate = Column(Integer)
    spo2 = Column(Integer)
    temperature = Column(Float)
    motion = Column(Float)
    battery_level = Column(
        Integer,
        CheckConstraint("battery_level BETWEEN 0 AND 100"),
    )

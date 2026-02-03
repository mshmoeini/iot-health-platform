# iot-health-platform
IoT Platform for Smart Health Monitoring (Course Project)
#  IoT Health Monitoring Platform

A modular, scalable **IoT-based health monitoring system** for real-time patient vitals tracking, alert management, and clinical dashboards.

---

##  Overview

This project implements a **distributed microservice architecture** designed to monitor patients using wearable wristbands.  
It supports real-time vital collection, alert lifecycle management, and UI-ready dashboards.

The system is composed of **three main layers**:

- **UI (Frontend)** – Clinician dashboard
- **Dashboard Backend API** – UI-oriented orchestration
- **Data Storage Service** – Database & domain logic

---

##  High-Level Architecture

```mermaid
flowchart LR
    UI[UI / Frontend]
    DBE[Dashboard Backend API]
    DS[Data Storage Service]
    MQTT[IoT Devices / MQTT]

    UI -->|REST| DBE
    DBE -->|REST| DS
    MQTT -->|MQTT| DBE

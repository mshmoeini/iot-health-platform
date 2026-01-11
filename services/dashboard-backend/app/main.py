from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from app.mqtt.alert_subscriber import start_in_background
# Start MQTT subscriber in background
from app.api import patients, vitals, alerts, dashboard
from app.api import wristbands

app = FastAPI(
    title="Dashboard Backend API",
    version="0.1.0",
)

# @app.on_event("startup")
# def startup_event():
#     start_in_background()

# --------------------------------------------------
# CORS configuration
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*" # Temporary for testing purposes
    ],
    allow_origin_regex=r"^https://.*\.ngrok-free\.dev$|^https://.*\.ngrok-free\.app$|^https://.*\.ngrok\.io$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    
)


# --------------------------------------------------
# Routers
# --------------------------------------------------
app.include_router(patients.router, prefix="/patients", tags=["patients"])
app.include_router(vitals.router, prefix="/vitals", tags=["vitals"])
app.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
app.include_router(wristbands.router, prefix="/wristbands", tags=["Wristbands"],)

@app.get("/", tags=["health"])
def health_check():
    return {"status": "backend running"}
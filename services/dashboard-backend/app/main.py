from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import patients, vitals, alerts, dashboard

app = FastAPI(
    title="Dashboard Backend API",
    version="0.1.0",
)

# --------------------------------------------------
# CORS configuration (Frontend access)
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite frontend
        "http://localhost:3000",  # React (optional)
    ],
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


@app.get("/", tags=["health"])
def health_check():
    return {"status": "backend running"}

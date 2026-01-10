from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import patients, vitals, alerts
# frontend repository imports would go here
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Dashboard Backend API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # فرانت Vite
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# fronend done
# app = FastAPI(title="Dashboard Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
app.include_router(patients.router, prefix="/patients", tags=["patients"])
app.include_router(vitals.router, prefix="/vitals", tags=["vitals"])
app.include_router(alerts.router, prefix="/alerts", tags=["alerts"])

# NEW: Dashboard Overview endpoints
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])


@app.get("/", tags=["health"])
def health_check():
    return {"status": "backend running"}

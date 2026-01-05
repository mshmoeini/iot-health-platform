from fastapi import FastAPI
from app.api import patients, vitals, alerts
# frontend repository imports would go here
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Dashboard Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",  # فرانت Vite
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# fronend done
# app = FastAPI(title="Dashboard Backend API")

app.include_router(patients.router, prefix="/patients")
app.include_router(vitals.router, prefix="/vitals")
app.include_router(alerts.router, prefix="/alerts")

@app.get("/")
def health_check():
    return {"status": "backend running"}

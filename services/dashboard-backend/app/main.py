from fastapi import FastAPI
from app.api import patients, vitals, alerts


app = FastAPI(title="Dashboard Backend API")

app.include_router(patients.router, prefix="/patients")
app.include_router(vitals.router, prefix="/vitals")
app.include_router(alerts.router, prefix="/alerts")

@app.get("/")
def health_check():
    return {"status": "backend running"}

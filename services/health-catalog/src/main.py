from fastapi import FastAPI
from src.routers.thresholds import router as thresholds_router

app = FastAPI(title="Health Catalog Service")

app.include_router(thresholds_router)


from fastapi import FastAPI
from src.routers.thresholds import router as thresholds_router
from src.routers.topics import router as topics_router
from src.routers.endpoints import router as endpoints_router

app = FastAPI(title="Health Catalog Service")

app.include_router(thresholds_router)
app.include_router(topics_router)
app.include_router(endpoints_router)

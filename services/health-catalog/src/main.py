from .routers.thresholds import router as thresholds_router
from .routers.topics import router as topics_router
from .routers.endpoints import router as endpoints_router
from .routers.patients import router as patients_router

from fastapi import FastAPI


app = FastAPI(title="Health Catalog Service")

app.include_router(thresholds_router)
app.include_router(topics_router)
app.include_router(endpoints_router)
app.include_router(patients_router)

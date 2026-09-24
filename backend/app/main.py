import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.advisory import router as advisory_router
from app.routes.agrin import router as agrin_router
from app.routes.crop_doctor import router as crop_doctor_router
from app.routes.farms import router as farms_router
from app.routes.guest import router as guest_router
from app.routes.satellite import router as satellite_router
from app.routes.weather import router as weather_router


app = FastAPI(
    title="AgriNexus API",
    version="1.0.0",
)


allowed_origins = [
    "http://localhost:5173",
]

production_origins = os.getenv(
    "CORS_ORIGINS",
    "",
)

for origin in production_origins.split(","):
    origin = origin.strip()

    if origin and origin not in allowed_origins:
        allowed_origins.append(origin)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(farms_router)
app.include_router(weather_router)
app.include_router(satellite_router)
app.include_router(advisory_router)
app.include_router(crop_doctor_router)
app.include_router(agrin_router)
app.include_router(guest_router)


@app.get("/")
def root():
    return {
        "message": "AgriNexus API is running",
    }


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "agrinexus-backend",
        "version": "1.0.0",
    }

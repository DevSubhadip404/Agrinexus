from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.advisory import router as advisory_router
from app.routes.agrin import router as agrin_router
from app.routes.crop_doctor import router as crop_doctor_router
from app.routes.farms import router as farms_router
from app.routes.weather import router as weather_router


app = FastAPI(
    title="AgriNexus API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(farms_router)
app.include_router(weather_router)
app.include_router(advisory_router)
app.include_router(crop_doctor_router)
app.include_router(agrin_router)


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
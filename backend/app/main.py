from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.farms import router as farms_router


app = FastAPI(
    title="AgriNexus API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(farms_router)


@app.get("/")
def root():
    return {
        "message": "AgriNexus API is running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "agrinexus-backend",
        "version": "1.0.0"
    }
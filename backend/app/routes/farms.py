from uuid import uuid4

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.firebase import db


router = APIRouter(
    prefix="/api/farms",
    tags=["Farms"],
)


class SoilData(BaseModel):
    ph: float
    nitrogen: str
    phosphorus: str
    potassium: str
    moisture: str


class FarmCreate(BaseModel):
    crop: str
    area_acres: float
    latitude: float
    longitude: float
    soil: SoilData


@router.get("")
def get_farms():
    farm_documents = db.collection("farms").stream()

    farms = []

    for document in farm_documents:
        farms.append(document.to_dict())

    return {
        "farms": farms,
    }


@router.get("/{farm_id}")
def get_farm(farm_id: str):
    document = (
        db.collection("farms")
        .document(farm_id)
        .get()
    )

    if not document.exists:
        raise HTTPException(
            status_code=404,
            detail="Farm not found",
        )

    return document.to_dict()


@router.post("")
def create_farm(farm: FarmCreate):
    farm_id = str(uuid4())

    new_farm = {
        "farm_id": farm_id,
        "crop": farm.crop,
        "area_acres": farm.area_acres,
        "latitude": farm.latitude,
        "longitude": farm.longitude,
        "soil": {
            "ph": farm.soil.ph,
            "nitrogen": farm.soil.nitrogen,
            "phosphorus": farm.soil.phosphorus,
            "potassium": farm.soil.potassium,
            "moisture": farm.soil.moisture,
        },
    }

    (
        db.collection("farms")
        .document(farm_id)
        .set(new_farm)
    )

    return {
        "success": True,
        "farm": new_farm,
    }
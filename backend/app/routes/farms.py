from typing import Literal
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.auth import get_current_user
from app.firebase import db


router = APIRouter(
    prefix="/api/farms",
    tags=["Farms"],
)


Level = Literal[
    "Low",
    "Medium",
    "High",
]


class SoilData(BaseModel):
    ph: float = Field(
        ge=0,
        le=14,
    )

    nitrogen: Level
    phosphorus: Level
    potassium: Level
    moisture: Level


class FarmCreate(BaseModel):
    crop: str = Field(
        min_length=1,
        max_length=50,
    )

    area_acres: float = Field(
        gt=0,
        le=100000,
    )

    latitude: float = Field(
        ge=-90,
        le=90,
    )

    longitude: float = Field(
        ge=-180,
        le=180,
    )

    soil: SoilData


@router.get("")
def get_farms(
    current_user=Depends(get_current_user),
):
    owner_uid = current_user["uid"]

    farm_documents = (
        db.collection("farms")
        .where(
            "owner_uid",
            "==",
            owner_uid,
        )
        .limit(100)
        .stream()
    )

    farms = [
        document.to_dict()
        for document in farm_documents
    ]

    return {
        "farms": farms,
    }


@router.get("/{farm_id}")
def get_farm(
    farm_id: str,
    current_user=Depends(get_current_user),
):
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

    farm = document.to_dict()

    if farm.get("owner_uid") != current_user["uid"]:
        raise HTTPException(
            status_code=404,
            detail="Farm not found",
        )

    return farm


@router.post("")
def create_farm(
    farm: FarmCreate,
    current_user=Depends(get_current_user),
):
    farm_id = str(uuid4())

    crop = farm.crop.strip()

    if not crop:
        raise HTTPException(
            status_code=422,
            detail="Crop name cannot be empty.",
        )

    new_farm = {
        "farm_id": farm_id,
        "owner_uid": current_user["uid"],
        "crop": crop,
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

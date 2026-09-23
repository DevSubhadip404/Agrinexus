from uuid import uuid4

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


router = APIRouter(
    prefix="/api/farms",
    tags=["Farms"]
)


class FarmCreate(BaseModel):
    crop: str
    area_acres: float
    latitude: float
    longitude: float


farms = []


@router.get("")
def get_farms():
    return {
        "farms": farms
    }


@router.get("/{farm_id}")
def get_farm(farm_id: str):
    for farm in farms:
        if farm["farm_id"] == farm_id:
            return farm

    raise HTTPException(
        status_code=404,
        detail="Farm not found"
    )


@router.post("")
def create_farm(farm: FarmCreate):
    new_farm = {
        "farm_id": str(uuid4()),
        "crop": farm.crop,
        "area_acres": farm.area_acres,
        "latitude": farm.latitude,
        "longitude": farm.longitude
    }

    farms.append(new_farm)

    return {
        "success": True,
        "farm": new_farm
    }
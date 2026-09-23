from fastapi import APIRouter, HTTPException
from requests import RequestException

from app.firebase import db
from app.services.weather import get_weather


router = APIRouter(
    prefix="/api/farms",
    tags=["Weather"],
)


@router.get("/{farm_id}/weather")
def get_farm_weather(farm_id: str):
    farm_document = (
        db.collection("farms")
        .document(farm_id)
        .get()
    )

    if not farm_document.exists:
        raise HTTPException(
            status_code=404,
            detail="Farm not found",
        )

    farm = farm_document.to_dict()

    try:
        weather = get_weather(
            latitude=farm["latitude"],
            longitude=farm["longitude"],
        )
    except RequestException:
        raise HTTPException(
            status_code=502,
            detail="Weather service unavailable",
        )

    return {
        "farm_id": farm_id,
        "weather": weather,
    }
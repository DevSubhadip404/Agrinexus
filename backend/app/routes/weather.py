import logging

from fastapi import APIRouter, Depends, HTTPException
from requests import RequestException

from app.auth import get_current_user
from app.firebase import db
from app.services.weather import get_weather


router = APIRouter(
    prefix="/api/farms",
    tags=["Weather"],
)

logger = logging.getLogger("uvicorn.error")


@router.get("/{farm_id}/weather")
def get_farm_weather(
    farm_id: str,
    current_user=Depends(get_current_user),
):
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

    if farm.get("owner_uid") != current_user["uid"]:
        raise HTTPException(
            status_code=404,
            detail="Farm not found",
        )

    try:
        weather = get_weather(
            latitude=farm["latitude"],
            longitude=farm["longitude"],
        )

    except RequestException as error:
        logger.exception(
            "Weather provider request failed"
        )

        if error.response is not None:
            logger.error(
                "Weather provider status: %s",
                error.response.status_code,
            )

            logger.error(
                "Weather provider response: %s",
                error.response.text[:500],
            )

        raise HTTPException(
            status_code=502,
            detail="Weather service unavailable",
        )

    return {
        "farm_id": farm_id,
        "weather": weather,
    }

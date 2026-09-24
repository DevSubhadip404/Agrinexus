from fastapi import APIRouter, HTTPException

from app.firebase import db
from app.services.gemini import generate_farm_explanation
from app.services.weather import get_weather


router = APIRouter(
    prefix="/api/farms",
    tags=["AI Advisory"],
)


@router.get("/{farm_id}/explanation")
def get_farm_explanation(
    farm_id: str,
    language: str = "English",
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

    try:
        weather = get_weather(
            latitude=farm["latitude"],
            longitude=farm["longitude"],
        )
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Could not load weather data",
        )

    try:
        explanation = generate_farm_explanation(
            crop=farm["crop"],
            temperature=weather["temperature"],
            humidity=weather["humidity"],
            rain_probability=weather["rain_probability"],
            soil_ph=farm["soil"]["ph"],
            nitrogen=farm["soil"]["nitrogen"],
            moisture=farm["soil"]["moisture"],
            language=language,
        )
    except Exception as error:
        print("Gemini error:", error)

        raise HTTPException(
            status_code=502,
            detail="Could not generate AI explanation",
        )

    return {
        "farm_id": farm_id,
        "language": language,
        "explanation": explanation,
        "model": "Gemini",
    }
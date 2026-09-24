from fastapi import APIRouter, HTTPException, Query
import requests

from app.firebase import db
from app.services.gemini import generate_farm_explanation
from app.services.weather import get_weather


router = APIRouter(
    prefix="/api/farms",
    tags=["Advisory"],
)


@router.get("/{farm_id}/explanation")
def get_farm_explanation(
    farm_id: str,
    language: str = Query(default="English"),
):
    document = db.collection("farms").document(farm_id).get()

    if not document.exists:
        raise HTTPException(
            status_code=404,
            detail="Farm not found",
        )

    farm = document.to_dict()

    try:
        weather = get_weather(
            latitude=farm["latitude"],
            longitude=farm["longitude"],
        )
    except requests.RequestException:
        raise HTTPException(
            status_code=502,
            detail="Could not load live weather data.",
        )

    soil = farm.get("soil", {})

    try:
        explanation = generate_farm_explanation(
            crop=farm["crop"],
            temperature=weather["temperature"],
            humidity=weather["humidity"],
            rain_probability=weather["rain_probability"],
            soil_ph=soil.get("ph"),
            nitrogen=soil.get("nitrogen"),
            moisture=soil.get("moisture"),
            language=language,
        )
    except Exception as error:
        print("Gemini advisory error:", error)

        raise HTTPException(
            status_code=502,
            detail="Could not generate farm explanation.",
        )

    available_signals = 0
    total_signals = 3

    if weather.get("temperature") is not None:
        available_signals += 1

    if soil.get("ph") is not None:
        available_signals += 1

    if farm.get("crop"):
        available_signals += 1

    confidence = round(
        (available_signals / total_signals) * 100
    )

    return {
        "farm_id": farm_id,
        "language": language,
        "explanation": explanation,
        "model": "Gemini",
        "confidence": {
            "score": confidence,
            "level": (
                "High"
                if confidence >= 80
                else "Medium"
                if confidence >= 50
                else "Low"
            ),
        },
        "provenance": [
            {
                "source": "Farmer Input",
                "data": "Crop and soil measurements",
                "status": "Provided",
            },
            {
                "source": "Open-Meteo",
                "data": "Live weather conditions",
                "status": "Live",
            },
            {
                "source": "Gemini",
                "data": "Natural-language advisory explanation",
                "status": "AI Generated",
            },
        ],
        "uncertainty": {
            "satellite_included": False,
            "message": (
                "This explanation uses farmer-provided soil data and live "
                "weather. Satellite vegetation signals are evaluated "
                "separately in the AgriNexus analysis layer."
            ),
        },
    }
from fastapi import APIRouter, HTTPException, Query
import requests

from app.firebase import db
from app.services.gemini import generate_farm_explanation
from app.services.satellite import get_satellite_signals
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

    satellite = None

    try:
        satellite = get_satellite_signals(
            latitude=farm["latitude"],
            longitude=farm["longitude"],
        )
    except Exception as error:
        print(
            "Satellite advisory context unavailable:",
            error,
        )

    try:
        explanation = generate_farm_explanation(
            crop=farm["crop"],
            temperature=weather["temperature"],
            humidity=weather["humidity"],
            rain_probability=weather["rain_probability"],
            soil_ph=soil.get("ph"),
            nitrogen=soil.get("nitrogen"),
            moisture=soil.get("moisture"),
            ndvi=(
                satellite.get("ndvi")
                if satellite
                else None
            ),
            ndmi=(
                satellite.get("ndmi")
                if satellite
                else None
            ),
            satellite_observed_at=(
                satellite.get("observed_at")
                if satellite
                else None
            ),
            language=language,
        )
    except Exception as error:
        print("Gemini advisory error:", error)

        raise HTTPException(
            status_code=502,
            detail="Could not generate farm explanation.",
        )

    available_signals = 0
    total_signals = 4

    if weather.get("temperature") is not None:
        available_signals += 1

    if soil.get("ph") is not None:
        available_signals += 1

    if farm.get("crop"):
        available_signals += 1

    if satellite is not None:
        available_signals += 1

    confidence = round(
        (available_signals / total_signals) * 100
    )

    provenance = [
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
    ]

    if satellite:
        provenance.append(
            {
                "source": "Sentinel-2",
                "data": (
                    f"NDVI {satellite['ndvi']} · "
                    f"NDMI {satellite['ndmi']} · "
                    f"Observed {satellite['observed_at']}"
                ),
                "status": "Satellite Observation",
            }
        )
    else:
        provenance.append(
            {
                "source": "Sentinel-2",
                "data": "No usable recent observation available",
                "status": "Unavailable",
            }
        )

    provenance.append(
        {
            "source": "Gemini",
            "data": (
                "Natural-language interpretation of "
                "available farm signals"
            ),
            "status": "AI Generated",
        }
    )

    if satellite:
        uncertainty_message = (
            "Gemini received farmer soil data, live weather, "
            "and a recent Sentinel-2 observation. NDVI and NDMI "
            "are treated as indicators rather than proof of a "
            "specific crop condition."
        )
    else:
        uncertainty_message = (
            "Gemini received farmer soil data and live weather. "
            "A usable recent Sentinel-2 observation was not "
            "available, so satellite signals were not included "
            "in this explanation."
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
        "provenance": provenance,
        "uncertainty": {
            "satellite_included": satellite is not None,
            "message": uncertainty_message,
        },
        "satellite_context": (
            {
                "ndvi": satellite["ndvi"],
                "ndmi": satellite["ndmi"],
                "observed_at": satellite["observed_at"],
                "scene_id": satellite["scene_id"],
                "source": satellite["source"],
            }
            if satellite
            else None
        ),
    }
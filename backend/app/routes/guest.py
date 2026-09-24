from typing import Literal

import requests
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from app.auth import get_current_user
from app.services.gemini import generate_farm_explanation
from app.services.satellite import get_satellite_signals
from app.services.weather import get_weather


router = APIRouter(
    prefix="/api/guest",
    tags=["Guest"],
)


Level = Literal[
    "Low",
    "Medium",
    "High",
]


class GuestLocation(BaseModel):
    latitude: float = Field(
        ge=-90,
        le=90,
    )

    longitude: float = Field(
        ge=-180,
        le=180,
    )


class GuestSoil(BaseModel):
    ph: float = Field(
        ge=0,
        le=14,
    )

    nitrogen: Level
    phosphorus: Level
    potassium: Level
    moisture: Level


class GuestFarmExplanation(BaseModel):
    farm_id: str = Field(
        min_length=1,
        max_length=100,
    )

    crop: str = Field(
        min_length=1,
        max_length=50,
    )

    latitude: float = Field(
        ge=-90,
        le=90,
    )

    longitude: float = Field(
        ge=-180,
        le=180,
    )

    soil: GuestSoil


@router.post("/weather")
def get_guest_weather(
    location: GuestLocation,
    current_user: dict = Depends(
        get_current_user
    ),
):
    del current_user

    weather = get_weather(
        latitude=location.latitude,
        longitude=location.longitude,
    )

    return {
        "weather": weather,
        "temporary": True,
    }


@router.post("/satellite")
def get_guest_satellite(
    location: GuestLocation,
    current_user: dict = Depends(
        get_current_user
    ),
):
    del current_user

    try:
        satellite = get_satellite_signals(
            latitude=location.latitude,
            longitude=location.longitude,
        )
    except Exception as error:
        print(
            "Guest satellite service error:",
            error,
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Could not find a usable recent Sentinel-2 "
                "observation for this farm."
            ),
        )

    return {
        "satellite": satellite,
        "temporary": True,
    }


@router.post("/explanation")
def get_guest_explanation(
    farm: GuestFarmExplanation,
    language: str = Query(
        default="English"
    ),
    current_user: dict = Depends(
        get_current_user
    ),
):
    del current_user

    try:
        weather = get_weather(
            latitude=farm.latitude,
            longitude=farm.longitude,
        )
    except requests.RequestException:
        raise HTTPException(
            status_code=502,
            detail=(
                "Could not load live weather data."
            ),
        )

    satellite = None

    try:
        satellite = get_satellite_signals(
            latitude=farm.latitude,
            longitude=farm.longitude,
        )
    except Exception as error:
        print(
            "Guest satellite advisory context unavailable:",
            error,
        )

    try:
        explanation = generate_farm_explanation(
            crop=farm.crop.strip(),
            temperature=weather[
                "temperature"
            ],
            humidity=weather[
                "humidity"
            ],
            rain_probability=weather[
                "rain_probability"
            ],
            soil_ph=farm.soil.ph,
            nitrogen=farm.soil.nitrogen,
            moisture=farm.soil.moisture,
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
                satellite.get(
                    "observed_at"
                )
                if satellite
                else None
            ),
            language=language,
        )
    except Exception as error:
        print(
            "Guest Gemini advisory error:",
            error,
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Could not generate farm explanation."
            ),
        )

    input_coverage = {
        "farmer_input": True,
        "weather": any(
            weather.get(key) is not None
            for key in (
                "temperature",
                "humidity",
                "rain_probability",
                "rainfall_forecast_mm",
            )
        ),
        "satellite": satellite is not None,
    }

    provenance = [
        {
            "source": "Farmer Input",
            "data": (
                "Crop and soil measurements"
            ),
            "status": "Provided",
        },
        {
            "source": weather.get(
                "source",
                "Weather Provider",
            ),
            "data": (
                "Current weather conditions"
            ),
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
                    f"Observed "
                    f"{satellite['observed_at']}"
                ),
                "status": (
                    "Satellite Observation"
                ),
            }
        )
    else:
        provenance.append(
            {
                "source": "Sentinel-2",
                "data": (
                    "No usable recent "
                    "observation available"
                ),
                "status": "Unavailable",
            }
        )

    provenance.append(
        {
            "source": "Gemini",
            "data": (
                "Natural-language "
                "interpretation of "
                "available farm signals"
            ),
            "status": "AI Generated",
        }
    )

    if satellite:
        uncertainty_message = (
            "Gemini received farmer soil data, "
            "live weather, and a recent "
            "Sentinel-2 observation. NDVI and "
            "NDMI are treated as indicators "
            "rather than proof of a specific "
            "crop condition."
        )
    else:
        uncertainty_message = (
            "Gemini received farmer soil data "
            "and live weather. A usable recent "
            "Sentinel-2 observation was not "
            "available, so satellite signals "
            "were not included in this "
            "explanation."
        )

    return {
        "farm_id": farm.farm_id,
        "language": language,
        "explanation": explanation,
        "model": "Gemini",
        "input_coverage": input_coverage,
        "provenance": provenance,
        "uncertainty": {
            "satellite_included": (
                satellite is not None
            ),
            "message": uncertainty_message,
        },
        "satellite_context": (
            {
                "ndvi": satellite[
                    "ndvi"
                ],
                "ndmi": satellite[
                    "ndmi"
                ],
                "observed_at": satellite[
                    "observed_at"
                ],
                "scene_id": satellite[
                    "scene_id"
                ],
                "source": satellite[
                    "source"
                ],
            }
            if satellite
            else None
        ),
        "temporary": True,
    }

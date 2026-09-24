import time

import requests
from requests import RequestException


OPEN_METEO_URL = (
    "https://api.open-meteo.com/v1/forecast"
)

MET_NORWAY_URL = (
    "https://api.met.no/weatherapi/"
    "locationforecast/2.0/compact"
)

MET_NORWAY_HEADERS = {
    "User-Agent": (
        "AgriNexus/1.0 "
        "https://agrinexus-astrael.vercel.app"
    )
}

CACHE_TTL_SECONDS = 600

_weather_cache: dict[
    tuple[float, float],
    tuple[float, dict],
] = {}


def _get_open_meteo(
    latitude: float,
    longitude: float,
):
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "precipitation,"
            "weather_code"
        ),
        "daily": (
            "precipitation_probability_max,"
            "precipitation_sum"
        ),
        "forecast_days": 1,
        "timezone": "auto",
    }

    response = requests.get(
        OPEN_METEO_URL,
        params=params,
        timeout=10,
    )

    response.raise_for_status()

    data = response.json()

    current = data.get("current", {})
    daily = data.get("daily", {})

    return {
        "temperature": current.get(
            "temperature_2m"
        ),
        "humidity": current.get(
            "relative_humidity_2m"
        ),
        "current_precipitation": current.get(
            "precipitation"
        ),
        "weather_code": current.get(
            "weather_code"
        ),
        "rain_probability": (
            daily.get(
                "precipitation_probability_max",
                [None],
            )[0]
        ),
        "rainfall_forecast_mm": (
            daily.get(
                "precipitation_sum",
                [None],
            )[0]
        ),
        "timezone": data.get("timezone"),
        "source": "Open-Meteo",
    }


def _get_met_norway(
    latitude: float,
    longitude: float,
):
    params = {
        "lat": round(latitude, 4),
        "lon": round(longitude, 4),
    }

    response = requests.get(
        MET_NORWAY_URL,
        params=params,
        headers=MET_NORWAY_HEADERS,
        timeout=10,
    )

    response.raise_for_status()

    data = response.json()

    timeseries = (
        data.get("properties", {})
        .get("timeseries", [])
    )

    if not timeseries:
        raise RequestException(
            "MET Norway returned no forecast data."
        )

    first = timeseries[0].get("data", {})

    instant = (
        first.get("instant", {})
        .get("details", {})
    )

    next_1_hour = (
        first.get("next_1_hours", {})
        .get("details", {})
    )

    next_6_hours = (
        first.get("next_6_hours", {})
        .get("details", {})
    )

    rain_probability = (
        next_1_hour.get(
            "probability_of_precipitation"
        )
    )

    if rain_probability is None:
        rain_probability = (
            next_6_hours.get(
                "probability_of_precipitation"
            )
        )

    rainfall_forecast = (
        next_6_hours.get(
            "precipitation_amount"
        )
    )

    if rainfall_forecast is None:
        rainfall_forecast = (
            next_1_hour.get(
                "precipitation_amount"
            )
        )

    return {
        "temperature": instant.get(
            "air_temperature"
        ),
        "humidity": instant.get(
            "relative_humidity"
        ),
        "current_precipitation": None,
        "weather_code": None,
        "rain_probability": rain_probability,
        "rainfall_forecast_mm": (
            rainfall_forecast
        ),
        "timezone": "UTC",
        "source": (
            "MET Norway Locationforecast"
        ),
    }


def get_weather(
    latitude: float,
    longitude: float,
):
    cache_key = (
        round(latitude, 4),
        round(longitude, 4),
    )

    cached = _weather_cache.get(
        cache_key
    )

    if cached:
        cached_at, cached_weather = cached

        if (
            time.monotonic() - cached_at
            < CACHE_TTL_SECONDS
        ):
            return cached_weather

    try:
        weather = _get_open_meteo(
            latitude,
            longitude,
        )

    except RequestException:
        weather = _get_met_norway(
            latitude,
            longitude,
        )

    _weather_cache[cache_key] = (
        time.monotonic(),
        weather,
    )

    return weather
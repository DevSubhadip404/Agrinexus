import requests


OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


def get_weather(latitude: float, longitude: float):
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
        "temperature": current.get("temperature_2m"),
        "humidity": current.get("relative_humidity_2m"),
        "current_precipitation": current.get("precipitation"),
        "weather_code": current.get("weather_code"),
        "rain_probability": (
            daily.get("precipitation_probability_max", [None])[0]
        ),
        "rainfall_forecast_mm": (
            daily.get("precipitation_sum", [None])[0]
        ),
        "timezone": data.get("timezone"),
        "source": "Open-Meteo",
    }
import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai


ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(ENV_PATH)


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing from backend/.env"
    )


client = genai.Client(
    api_key=GEMINI_API_KEY
)


PRIMARY_MODEL = "gemini-3.6-flash"
FALLBACK_MODEL = "gemini-3.5-flash-lite"


def generate_farm_explanation(
    crop: str,
    temperature: float,
    humidity: float,
    rain_probability: float,
    soil_ph: float,
    nitrogen: str,
    moisture: str,
    ndvi: float | None = None,
    ndmi: float | None = None,
    satellite_observed_at: str | None = None,
    language: str = "English",
) -> str:
    satellite_context = ""

    if ndvi is not None and ndmi is not None:
        satellite_context = f"""
Sentinel-2 satellite observation:
NDVI: {ndvi}
NDMI: {ndmi}
Observation time: {satellite_observed_at or "Unknown"}
"""

    prompt = f"""
You are AgriNexus, an agricultural advisory assistant.

Explain the following farm conditions to a farmer in simple {language}.

Crop: {crop}

Live weather:
Temperature: {temperature}°C
Humidity: {humidity}%
Rain probability: {rain_probability}%

Farmer-provided soil data:
Soil pH: {soil_ph}
Nitrogen level: {nitrogen}
Soil moisture: {moisture}

{satellite_context}

Instructions:
- Use only the measurements provided.
- Do not invent measurements, diseases, pests, or field conditions.
- Clearly distinguish satellite signals from soil and weather measurements.
- Treat NDVI and NDMI as indicators, not proof of a specific problem.
- If NDVI appears relatively low, suggest field inspection rather than claiming crop stress with certainty.
- If NDMI appears relatively low, mention possible vegetation moisture stress cautiously.
- Consider rainfall probability before recommending irrigation.
- Prefer regenerative practices such as mulch, residue retention, compost, crop rotation, cover crops, and efficient water use when relevant.
- Do not prescribe restricted pesticides or chemical dosages.
- Do not diagnose disease from these measurements alone.
- Keep the advice practical and farmer-friendly.
- Keep the response under 180 words.
"""

    try:
        response = client.models.generate_content(
            model=PRIMARY_MODEL,
            contents=prompt,
        )

        return response.text

    except Exception as primary_error:
        error_text = str(primary_error).lower()

        can_fallback = (
            "429" in error_text
            or "resource_exhausted" in error_text
            or "quota" in error_text
            or "503" in error_text
            or "unavailable" in error_text
            or "high demand" in error_text
        )

        if not can_fallback:
            raise

        print(
            f"{PRIMARY_MODEL} unavailable. "
            f"Trying {FALLBACK_MODEL}..."
        )

        response = client.models.generate_content(
            model=FALLBACK_MODEL,
            contents=prompt,
        )

        return response.text
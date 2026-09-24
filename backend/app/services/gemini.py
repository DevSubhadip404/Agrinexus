import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai


ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(ENV_PATH)


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing."
    )


client = genai.Client(
    api_key=GEMINI_API_KEY
)


PRIMARY_MODEL = "gemini-3.6-flash"
FALLBACK_MODEL = "gemini-3.5-flash-lite"


def _format_measurement(
    value,
    suffix: str = "",
) -> str:
    if value is None:
        return "Unavailable"

    return f"{value}{suffix}"


def generate_farm_explanation(
    crop: str,
    temperature: float | None,
    humidity: float | None,
    rain_probability: float | None,
    soil_ph: float | None,
    nitrogen: str | None,
    moisture: str | None,
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
Satellite observation time: {satellite_observed_at or "Unknown"}
"""

    prompt = f"""
You are AgriNexus, an agricultural advisory assistant.

Explain the following farm conditions to a farmer in clear, simple,
professional {language}.

Crop: {crop}

Current weather:
Temperature: {_format_measurement(temperature, "°C")}
Humidity: {_format_measurement(humidity, "%")}
Rain probability: {_format_measurement(rain_probability, "%")}

Farmer-provided soil data:
Soil pH: {_format_measurement(soil_ph)}
Nitrogen level: {nitrogen or "Unavailable"}
Soil moisture: {moisture or "Unavailable"}

{satellite_context}

Instructions:
- Use only the measurements provided.
- If a measurement is marked Unavailable, do not infer or invent its value.
- Do not convert missing rain probability into 0%.
- Do not invent measurements, dates, diseases, pests, or field conditions.
- Current weather and the Sentinel-2 observation may come from different dates.
- Never describe the Sentinel-2 observation date as "today".
- Clearly distinguish current weather, farmer-provided soil data, and satellite observations.
- Treat NDVI and NDMI as indicators, not proof of a specific crop problem.
- Use the provided NDVI and NDMI values only for interpretation.
- Do not repeat the numeric NDVI or NDMI values in the explanation.
- Refer to them as vegetation and vegetation-moisture indicators instead.
- If NDVI appears relatively low, recommend field inspection rather than claiming crop stress with certainty.
- If NDMI appears relatively low, describe possible vegetation moisture stress cautiously.
- Only use rain probability when it is actually available.
- Prefer regenerative practices such as mulch, residue retention, compost, crop rotation, cover crops, and efficient water use when relevant.
- Do not prescribe restricted pesticides or chemical dosages.
- Do not diagnose disease from these measurements alone.
- Avoid unnecessary greetings and conversational filler.
- Keep the explanation practical, concise, and professional.
- Write plain text only.
- Do not use Markdown.
- Do not use asterisks.
- Do not use Markdown headings.
- Use short readable paragraphs.
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
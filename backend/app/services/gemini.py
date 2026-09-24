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


def generate_farm_explanation(
    crop: str,
    temperature: float,
    humidity: float,
    rain_probability: float,
    soil_ph: float,
    nitrogen: str,
    moisture: str,
    language: str = "English",
) -> str:
    prompt = f"""
You are AgriNexus, an agricultural advisory assistant.

Explain the following farm conditions to a farmer in simple {language}.

Crop: {crop}
Temperature: {temperature}°C
Humidity: {humidity}%
Rain probability: {rain_probability}%
Soil pH: {soil_ph}
Nitrogen level: {nitrogen}
Soil moisture: {moisture}

Rules:
- Use only the measurements provided.
- Do not invent additional measurements.
- Keep the explanation practical and easy to understand.
- Mention irrigation or regenerative practices only when relevant.
- Do not claim certainty about disease diagnosis.
- Keep the response under 150 words.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    return response.text
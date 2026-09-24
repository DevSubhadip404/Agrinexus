import json
import os
import time
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types


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


def diagnose_crop_image(
    image_bytes: bytes,
    mime_type: str,
    crop: str,
):
    prompt = f"""
You are AgriNexus Crop Doctor.

Analyze this image of a {crop} crop.

Return ONLY valid JSON in exactly this structure:

{{
  "disease": "string",
  "confidence": 0,
  "severity": "Low | Medium | High",
  "symptoms": ["string"],
  "actions": ["string"],
  "uncertain": false
}}

Rules:
- Use only visible evidence from the image.
- Do not claim certainty when visual evidence is weak.
- If no disease can be identified reliably, set:
  "disease": "Uncertain"
  and
  "uncertain": true
- Confidence must be an integer from 0 to 100.
- Do not prescribe restricted pesticides or chemical dosages.
- Recommended actions should focus on monitoring, sanitation,
  irrigation practices, crop care, and seeking local expert advice.
- Keep symptoms and actions concise.
- Do not include markdown.
- Do not include text outside the JSON object.
"""

    max_attempts = 3

    for attempt in range(max_attempts):
        try:
            response = client.models.generate_content(
                model="gemini-3.5-flash-lite",
                contents=[
                    types.Part.from_bytes(
                        data=image_bytes,
                        mime_type=mime_type,
                    ),
                    prompt,
                ],
            )

            text = response.text.strip()

            if text.startswith("```json"):
                text = text.removeprefix("```json")
                text = text.removesuffix("```")
                text = text.strip()

            elif text.startswith("```"):
                text = text.removeprefix("```")
                text = text.removesuffix("```")
                text = text.strip()

            return json.loads(text)

        except Exception as error:
            error_text = str(error)

            is_temporary_error = (
                "503" in error_text
                or "UNAVAILABLE" in error_text
                or "high demand" in error_text.lower()
            )

            if (
                is_temporary_error
                and attempt < max_attempts - 1
            ):
                wait_seconds = 2 ** (attempt + 1)

                print(
                    f"Gemini busy. Retrying in "
                    f"{wait_seconds} seconds..."
                )

                time.sleep(wait_seconds)
                continue

            raise
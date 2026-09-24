from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


router = APIRouter(
    prefix="/api/agrin",
    tags=["AgriN Open"],
)


NODES = [
    {
        "node_id": "agrin-in",
        "country": "India",
        "country_code": "IN",
        "status": "Online",
        "models": 12,
        "datasets": 48,
        "capabilities": [
            "Crop Stress",
            "Disease Detection",
            "Soil Intelligence",
        ],
    },
    {
        "node_id": "agrin-br",
        "country": "Brazil",
        "country_code": "BR",
        "status": "Online",
        "models": 9,
        "datasets": 31,
        "capabilities": [
            "Drought Risk",
            "Soybean Intelligence",
            "Climate Risk",
        ],
    },
    {
        "node_id": "agrin-za",
        "country": "South Africa",
        "country_code": "ZA",
        "status": "Online",
        "models": 6,
        "datasets": 18,
        "capabilities": [
            "Maize Intelligence",
            "Soil Moisture",
            "Water Management",
        ],
    },
]


MODELS = [
    {
        "model_id": "agrin-in-rice-stress-v1",
        "name": "Rice Stress Detection Model",
        "country": "India",
        "country_code": "IN",
        "crop": "Rice",
        "category": "Crop Stress",
        "version": "1.0",
        "schema": "AgriN Model Schema",
        "license": "Open Research",
        "input_types": [
            "Satellite",
            "Weather",
        ],
        "output_type": "Crop Stress Score",
        "stac_compatible": True,
    },
    {
        "model_id": "agrin-br-drought-v12",
        "name": "Drought Risk Model",
        "country": "Brazil",
        "country_code": "BR",
        "crop": "Soybean",
        "category": "Climate Risk",
        "version": "1.2",
        "schema": "AgriN Model Schema",
        "license": "Open Research",
        "input_types": [
            "Weather",
            "Soil",
        ],
        "output_type": "Drought Risk",
        "stac_compatible": True,
    },
    {
        "model_id": "agrin-za-soil-moisture-v1",
        "name": "Soil Moisture Advisory Model",
        "country": "South Africa",
        "country_code": "ZA",
        "crop": "Maize",
        "category": "Soil Intelligence",
        "version": "1.0",
        "schema": "AgriN Model Schema",
        "license": "Open Research",
        "input_types": [
            "Soil",
            "Weather",
        ],
        "output_type": "Moisture Advisory",
        "stac_compatible": True,
    },
    {
        "model_id": "agrin-in-rice-disease-v11",
        "name": "Rice Disease Screening Model",
        "country": "India",
        "country_code": "IN",
        "crop": "Rice",
        "category": "Disease Detection",
        "version": "1.1",
        "schema": "AgriN Model Schema",
        "license": "Open Research",
        "input_types": [
            "Image",
        ],
        "output_type": "Disease Screening",
        "stac_compatible": False,
    },
]


class ModelExchangeRequest(BaseModel):
    model_id: str
    target_country: str
    target_crop: str


def find_model(model_id: str):
    for model in MODELS:
        if model["model_id"] == model_id:
            return model

    return None


@router.get("/nodes")
def get_nodes():
    return {
        "network": "AgriN Open",
        "nodes": NODES,
    }


@router.get("/models")
def get_models():
    return {
        "schema": "AgriN Model Schema",
        "models": MODELS,
    }


@router.get("/models/{model_id}")
def get_model(model_id: str):
    model = find_model(model_id)

    if not model:
        raise HTTPException(
            status_code=404,
            detail="AgriN model not found",
        )

    return model


@router.post("/exchange")
def exchange_model(request: ModelExchangeRequest):
    model = find_model(request.model_id)

    if not model:
        raise HTTPException(
            status_code=404,
            detail="AgriN model not found",
        )

    same_country = (
        model["country"].lower()
        == request.target_country.lower()
    )

    same_crop = (
        model["crop"].lower()
        == request.target_crop.lower()
    )

    compatibility_score = 100
    notes = []

    if not same_country:
        compatibility_score -= 20
        notes.append(
            "Model originates from a different agricultural region. "
            "Local validation is recommended before production use."
        )

    if not same_crop:
        compatibility_score -= 45
        notes.append(
            f"Model was trained for {model['crop']}, not "
            f"{request.target_crop}. Crop-specific validation is required."
        )

    if model["stac_compatible"]:
        notes.append(
            "Geospatial metadata follows a STAC-compatible format."
        )

    if same_crop:
        notes.append(
            "Crop type matches the model's declared target crop."
        )

    if compatibility_score >= 80:
        exchange_status = "Compatible"
    elif compatibility_score >= 50:
        exchange_status = "Review Required"
    else:
        exchange_status = "Not Recommended Without Adaptation"

    return {
        "exchange_id": (
            f"{model['country_code'].lower()}-"
            f"{request.target_country.lower().replace(' ', '-')}-"
            f"{model['model_id']}"
        ),
        "source_node": {
            "country": model["country"],
            "country_code": model["country_code"],
        },
        "target_context": {
            "country": request.target_country,
            "crop": request.target_crop,
        },
        "model": {
            "model_id": model["model_id"],
            "name": model["name"],
            "version": model["version"],
            "category": model["category"],
            "schema": model["schema"],
        },
        "compatibility": {
            "score": compatibility_score,
            "status": exchange_status,
            "crop_match": same_crop,
            "same_country": same_country,
        },
        "provenance": {
            "provider": model["country"],
            "license": model["license"],
            "schema": model["schema"],
            "stac_compatible": model["stac_compatible"],
        },
        "adaptation_notes": notes,
        "disclaimer": (
            "Compatibility is a prototype interoperability assessment. "
            "Transferred agricultural models should be locally validated "
            "before operational deployment."
        ),
    }
from fastapi import APIRouter, HTTPException


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
    for model in MODELS:
        if model["model_id"] == model_id:
            return model

    raise HTTPException(
        status_code=404,
        detail="AgriN model not found",
    )
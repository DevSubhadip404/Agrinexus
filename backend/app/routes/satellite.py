from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user
from app.firebase import db
from app.services.satellite import get_satellite_signals


router = APIRouter(
    prefix="/api/farms",
    tags=["Satellite"],
)


@router.get("/{farm_id}/satellite")
def get_farm_satellite(
    farm_id: str,
    current_user=Depends(get_current_user),
):
    document = (
        db.collection("farms")
        .document(farm_id)
        .get()
    )

    if not document.exists:
        raise HTTPException(
            status_code=404,
            detail="Farm not found",
        )

    farm = document.to_dict()

    if farm.get("owner_uid") != current_user["uid"]:
        raise HTTPException(
            status_code=404,
            detail="Farm not found",
        )

    latitude = farm.get("latitude")
    longitude = farm.get("longitude")

    if latitude is None or longitude is None:
        raise HTTPException(
            status_code=400,
            detail="Farm coordinates are missing.",
        )

    try:
        satellite = get_satellite_signals(
            latitude=latitude,
            longitude=longitude,
        )

    except Exception as error:
        print(
            "Satellite service error:",
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
        "farm_id": farm_id,
        "satellite": satellite,
    }

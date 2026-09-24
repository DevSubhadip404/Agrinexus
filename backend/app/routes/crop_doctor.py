from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.services.crop_doctor import diagnose_crop_image


router = APIRouter(
    prefix="/api/crop-doctor",
    tags=["Crop Doctor"],
)


ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


@router.post("/diagnose")
async def diagnose_crop(
    crop: str = Form(...),
    image: UploadFile = File(...),
):
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG, and WebP images are supported.",
        )

    image_bytes = await image.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty.",
        )

    try:
        diagnosis = diagnose_crop_image(
            image_bytes=image_bytes,
            mime_type=image.content_type,
            crop=crop,
        )

    except Exception as error:
        print("Crop Doctor error:", error)

        raise HTTPException(
            status_code=502,
            detail="Could not analyze crop image.",
        )

    return {
        "crop": crop,
        "filename": image.filename,
        "diagnosis": diagnosis,
        "model": "Gemini",
    }
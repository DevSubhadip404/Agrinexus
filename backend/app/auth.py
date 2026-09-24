from fastapi import Header, HTTPException
from firebase_admin import auth


def get_current_user(
    authorization: str | None = Header(default=None),
):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authentication required.",
        )

    scheme, _, token = authorization.partition(" ")

    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header.",
        )

    try:
        decoded_token = auth.verify_id_token(token)

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token.",
        )

    return decoded_token

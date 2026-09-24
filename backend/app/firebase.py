import base64
import json
import os
from pathlib import Path

import firebase_admin
from firebase_admin import credentials, firestore


SERVICE_ACCOUNT_PATH = (
    Path(__file__).resolve().parents[1]
    / "firebase-service-account.json"
)


def get_firebase_credential():
    encoded_credentials = os.getenv(
        "FIREBASE_SERVICE_ACCOUNT_BASE64"
    )

    if encoded_credentials:
        try:
            decoded = base64.b64decode(
                encoded_credentials
            ).decode("utf-8")

            service_account_info = json.loads(decoded)

            return credentials.Certificate(
                service_account_info
            )

        except Exception as error:
            raise RuntimeError(
                "Invalid FIREBASE_SERVICE_ACCOUNT_BASE64."
            ) from error

    if SERVICE_ACCOUNT_PATH.exists():
        return credentials.Certificate(
            str(SERVICE_ACCOUNT_PATH)
        )

    raise RuntimeError(
        "Firebase credentials were not found. "
        "Provide FIREBASE_SERVICE_ACCOUNT_BASE64 "
        "or firebase-service-account.json."
    )


if not firebase_admin._apps:
    credential = get_firebase_credential()

    firebase_admin.initialize_app(credential)


db = firestore.client()
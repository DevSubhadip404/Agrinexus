from pathlib import Path

import firebase_admin
from firebase_admin import credentials, firestore


SERVICE_ACCOUNT_PATH = (
    Path(__file__).resolve().parents[1]
    / "firebase-service-account.json"
)


if not firebase_admin._apps:
    credential = credentials.Certificate(
        str(SERVICE_ACCOUNT_PATH)
    )

    firebase_admin.initialize_app(credential)


db = firestore.client()
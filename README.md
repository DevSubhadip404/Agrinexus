<div align="center">

<img src="frontend/public/agrinexus-icon.svg" alt="AgriNexus" width="88" />

# AgriNexus

### AI-Powered Regenerative Agricultural Intelligence

AgriNexus combines live weather, Sentinel-2 satellite observations, farmer-provided soil indicators, Gemini-powered advisory, crop image screening, and an agricultural interoperability prototype in one transparent farm intelligence workspace.

**Built by Team Astrael · Code for Communities 2.0**

[Live Application](https://agrinexus-astrael.vercel.app) · [Backend API](https://agrinexus-sacr.onrender.com) · [API Docs](https://agrinexus-sacr.onrender.com/docs)

</div>

---

## Overview

Farm decisions often depend on information scattered across separate systems: soil observations, weather forecasts, satellite imagery, crop-health signals, agronomic recommendations, and AI tools.

AgriNexus brings these signals together at the farm level while clearly showing where each piece of information came from.

The platform emphasizes:

- real external data instead of fake fallback values
- source provenance
- uncertainty
- regenerative recommendations
- multilingual explanation
- persistent authenticated farms
- temporary guest exploration

---

## Core Features

### Farm Intelligence

Farm profiles can contain:

- crop
- acreage
- latitude and longitude
- soil pH
- nitrogen level
- phosphorus level
- potassium level
- soil moisture level

Signed-in farms are stored in Firestore and associated with the authenticated Firebase user.

---

### Live Weather

AgriNexus uses:

- **Open-Meteo** as the primary weather provider
- **MET Norway Locationforecast** as a real fallback provider

Available signals can include:

- temperature
- relative humidity
- precipitation
- rainfall probability
- forecast rainfall

The UI displays the actual provider used by the backend.

---

### Sentinel-2 Intelligence

AgriNexus retrieves recent **Sentinel-2 Level-2A** imagery through the **Microsoft Planetary Computer STAC API**.

The system samples:

- B04 — Red
- B08 — Near Infrared
- B11 — Short-Wave Infrared
- SCL — Scene Classification Layer

It calculates:

- **NDVI** — vegetation indicator
- **NDMI** — vegetation-moisture indicator

Clouds, cloud shadows, cirrus, snow, invalid pixels, and unusable observations are filtered before a scene is accepted.

If no usable observation exists, AgriNexus reports the satellite source as unavailable instead of inserting simulated values.

---

### Gemini Farm Advisory

Google Gemini translates available farm evidence into a concise farmer-friendly explanation.

The advisory may use:

- farmer-provided soil data
- live weather
- Sentinel-2 vegetation indicators
- Sentinel-2 vegetation-moisture indicators

The prompt instructs Gemini to:

- avoid inventing unavailable measurements
- distinguish farmer data from external data
- avoid diagnosing disease from farm measurements alone
- avoid treating satellite indicators as proof of a specific crop problem
- avoid describing older satellite observations as today's measurements
- recommend field inspection when uncertainty exists
- prefer relevant regenerative practices

The interface also shows **Input Coverage & Provenance** beside the AI explanation.

---

### Regenerative Recommendations

AgriNexus provides transparent rule-based recommendations including:

- crop rotation
- compost
- residue retention
- mulch
- cover crops
- efficient irrigation
- drainage inspection
- nitrogen-building practices
- soil pH considerations
- field inspection when satellite indicators appear unusual

---

### Multilingual Advisory

Farm explanations currently support:

- English
- Hindi
- Telugu

The architecture can be extended to additional languages.

---

### Crop Doctor

Crop Doctor uses Gemini multimodal analysis for AI-assisted crop-image screening.

Supported formats:

- JPEG
- PNG
- WebP

Maximum image size:

- 8 MB

Crop Doctor is intended as decision support and does not replace laboratory diagnosis or qualified agricultural professionals.

---

## Authentication

AgriNexus supports two access modes.

### Continue with Google

Google authentication is handled through Firebase Authentication.

Signed-in users receive:

- persistent private farms
- Firestore storage
- access across sessions
- authenticated farm analysis

Backend farm routes verify Firebase ID tokens and enforce ownership through the authenticated Firebase UID.

### Try AgriNexus as Guest

Guest mode uses Firebase Anonymous Authentication.

Guest farms:

- remain in browser `sessionStorage`
- are not written to Firestore
- disappear when the guest session ends

Guest users can still access:

- farm creation
- live weather
- Sentinel-2 analysis
- Gemini advisory
- Crop Doctor

---

## Transparency & Provenance

AgriNexus separates measured evidence from AI interpretation.

The advisory identifies:

- **Farmer Input**
- **Weather Provider**
- **Sentinel-2**
- **Gemini**

The platform reports source availability rather than presenting an artificial AI-accuracy percentage.

Example:

    Farmer Input · Available
    Weather · Available
    Satellite · Available

    All advisory sources available

If a real external source fails, the UI reports it as unavailable.

---

## AgriN Commons

**AgriN Commons** is a hackathon interoperability prototype exploring how agricultural models and metadata could be exchanged between regions.

The prototype includes simulated agricultural contexts representing:

- India
- Brazil
- South Africa

Example model categories include:

- crop stress
- drought risk
- disease screening
- soil intelligence
- climate risk

Prototype model metadata includes:

- model ID
- source country
- crop
- category
- version
- input types
- output type
- license
- schema
- STAC compatibility
- adaptation notes

The model-exchange endpoint demonstrates a simple compatibility assessment using factors such as crop match, source region, and declared metadata.

> **Important:** AgriN Commons nodes, model catalogs, datasets, compatibility results, and BRICS-oriented exchange examples are simulated hackathon concepts. They are not real government systems, official national integrations, or operational BRICS infrastructure.

---

## Architecture

    Farmer / User
           |
           v
    React + TypeScript Frontend
           |
           +----------------------+
           |                      |
           v                      v
    Firebase Authentication     FastAPI Backend
      |          |                |
      |          |                +--> Cloud Firestore
      |          |                |
      |          |                +--> Weather Service
      |          |                |      |- Open-Meteo
      |          |                |      `- MET Norway
      |          |                |
      |          |                +--> Satellite Service
      |          |                |      `- Microsoft Planetary Computer
      |          |                |          `- Sentinel-2 L2A
      |          |                |
      |          |                +--> Google Gemini
      |          |                |      |- Farm Advisory
      |          |                |      `- Crop Doctor
      |          |                |
      |          |                `--> AgriN Commons Prototype
      |          |
      |          `--> Anonymous Guest Auth
      |
      `--> Google Sign-In

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Firebase Web SDK

### Backend

- Python
- FastAPI
- Pydantic
- Uvicorn
- Firebase Admin SDK
- Cloud Firestore

### AI

- Google Gemini
- Gemini multimodal analysis

### Earth Observation

- Sentinel-2 Level-2A
- Microsoft Planetary Computer
- STAC
- pystac-client
- Rasterio
- NumPy

### Weather

- Open-Meteo
- MET Norway Locationforecast

### Deployment

- Vercel — frontend
- Render — backend

---

## Project Structure

    Agrinexus/
    ├── backend/
    │   ├── app/
    │   │   ├── routes/
    │   │   ├── services/
    │   │   ├── auth.py
    │   │   ├── firebase.py
    │   │   └── main.py
    │   └── requirements.txt
    │
    ├── frontend/
    │   ├── public/
    │   └── src/
    │       ├── components/
    │       ├── context/
    │       ├── pages/
    │       ├── services/
    │       ├── types/
    │       ├── firebase.ts
    │       └── main.tsx
    │
    └── README.md

---

## API Overview

### Health

    GET /api/health

### Persistent Farms

    GET  /api/farms
    GET  /api/farms/{farm_id}
    POST /api/farms

### Farm Analysis

    GET /api/farms/{farm_id}/weather
    GET /api/farms/{farm_id}/satellite
    GET /api/farms/{farm_id}/explanation

### Crop Doctor

    POST /api/crop-doctor/diagnose

### Guest Analysis

    POST /api/guest/weather
    POST /api/guest/satellite
    POST /api/guest/explanation

Guest analysis requires a valid Firebase identity while keeping the guest farm itself out of Firestore.

### AgriN Commons Prototype

    GET  /api/agrin/nodes
    GET  /api/agrin/models
    GET  /api/agrin/models/{model_id}
    POST /api/agrin/exchange

---

## Run Locally

### Backend

Create and activate a virtual environment:

    python -m venv .venv
    source .venv/bin/activate

Install dependencies:

    pip install -r backend/requirements.txt

Start FastAPI:

    cd backend
    uvicorn app.main:app --reload

Local backend:

    http://127.0.0.1:8000

API documentation:

    http://127.0.0.1:8000/docs

Required backend environment variables include:

    GEMINI_API_KEY=your_key
    FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_service_account

Never commit Firebase service-account credentials.

### Frontend

In another terminal:

    cd frontend
    npm install
    npm run dev

Create `frontend/.env` containing:

    VITE_API_BASE_URL=http://127.0.0.1:8000

Local frontend:

    http://localhost:5173

Firebase Authentication must have these providers enabled:

- Google
- Anonymous

---

## Production

### Frontend

https://agrinexus-astrael.vercel.app

Production frontend environment:

    VITE_API_BASE_URL=https://agrinexus-sacr.onrender.com

### Backend

https://agrinexus-sacr.onrender.com

Important backend environment variables include:

    GEMINI_API_KEY=...
    FIREBASE_SERVICE_ACCOUNT_BASE64=...
    CORS_ORIGINS=https://agrinexus-astrael.vercel.app

---

## Security

Current prototype protections include:

- Firebase ID-token verification
- per-user farm ownership
- authenticated persistent farm analysis
- Firebase anonymous guest identity
- session-only guest farm storage
- server-side farm validation
- coordinate validation
- soil pH validation
- crop-name validation
- image MIME-type validation
- 8 MB Crop Doctor upload limit
- production CORS restrictions
- backend-only API secrets

---

## Real Integrations vs Prototype Components

### Real Services

- Open-Meteo
- MET Norway
- Sentinel-2 Level-2A
- Microsoft Planetary Computer
- Google Gemini
- Firebase Authentication
- Cloud Firestore

### Prototype / Simulated Concepts

- AgriN Commons national nodes
- cross-country agricultural model catalog
- model exchange workflow
- compatibility scores
- BRICS-oriented interoperability examples

---

## Suggested Demo Flow

1. Open the AgriNexus landing page.
2. Choose **Try AgriNexus as Guest**.
3. Create a temporary farm.
4. Open **Farm Analysis**.
5. Show live weather.
6. Show Sentinel-2 NDVI and NDMI.
7. Show regenerative recommendations.
8. Show Gemini advisory, provenance, and uncertainty.
9. Open Crop Doctor and analyze a crop image.
10. Open AgriN Commons and explain the interoperability prototype.
11. Demonstrate Google sign-in for persistent private farms.

---

## Design Principles

### Transparency over artificial confidence

AgriNexus shows which evidence sources were available instead of presenting an uncalibrated AI-confidence percentage.

### No fake fallback data

Unavailable live weather or satellite observations remain explicitly unavailable.

### AI as interpretation, not evidence

Measured signals and AI-generated explanation are presented separately.

### Regenerative-first recommendations

Recommendations prioritize soil resilience, efficient water use, crop rotation, organic matter, and other regenerative practices where relevant.

### Interoperability with provenance

Agricultural model exchange should retain origin, schema, license, compatibility information, and adaptation requirements.

---

## Future Scope

Potential extensions include:

- field polygon analysis
- Sentinel-2 time-series monitoring
- crop-specific agronomic rule libraries
- additional soil sensors
- pest and disease surveillance
- additional regional languages
- offline and low-connectivity workflows
- PWA support
- farmer-to-extension-worker collaboration
- agricultural AI model cards
- standardized agricultural schemas
- locally validated cross-region agricultural models

---

## Acknowledgements & Open-Source Components

AgriNexus is an original hackathon implementation built using open-source libraries and external data/API services. Copyright, licenses, trademarks, and terms for third-party components remain with their respective maintainers and providers.

### Google Technologies

- [Google Gemini](https://ai.google.dev/) — generative AI for multilingual farm advisory and multimodal Crop Doctor analysis.
- [Firebase](https://firebase.google.com/) — authentication, anonymous guest identity, and Cloud Firestore integration.

### Earth Observation

- [Copernicus Sentinel-2](https://dataspace.copernicus.eu/explore-data/data-collections/sentinel-data/sentinel-2) — Level-2A Earth-observation imagery used for vegetation and vegetation-moisture indicators.
- [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/) — STAC-based access to Sentinel-2 imagery.
- [pystac-client](https://github.com/stac-utils/pystac-client) — STAC catalog querying.
- [Rasterio](https://rasterio.readthedocs.io/) — geospatial raster access and sampling.
- [NumPy](https://numpy.org/) — numerical calculations used in satellite-index processing.

### Weather

- [Open-Meteo](https://open-meteo.com/) — primary live weather and forecast provider.
- [MET Norway Locationforecast](https://api.met.no/weatherapi/locationforecast/2.0/documentation) — fallback live weather provider.

### Application Frameworks & Libraries

- [React](https://react.dev/) — frontend user interface.
- [TypeScript](https://www.typescriptlang.org/) — frontend application language.
- [Vite](https://vite.dev/) — frontend development and build tooling.
- [Tailwind CSS](https://tailwindcss.com/) — user-interface styling.
- [FastAPI](https://fastapi.tiangolo.com/) — backend API framework.
- [Pydantic](https://docs.pydantic.dev/) — backend data validation.
- [Uvicorn](https://www.uvicorn.org/) — ASGI application server.

AgriNexus does not claim ownership of these third-party technologies or datasets. Their use is subject to their respective licenses, attribution requirements, API policies, and terms of service.

---

## Responsible Use

AgriNexus is a hackathon prototype and agricultural decision-support platform.

Its recommendations and AI-generated explanations should not replace:

- field inspection
- local agronomic expertise
- laboratory soil testing
- plant pathology testing
- regulatory guidance

Weather forecasts, satellite indices, image screening, and AI interpretation contain uncertainty and should be evaluated alongside local field conditions.

---

## Team

### Team Astrael

**Project:** AgriNexus
**Hackathon:** Code for Communities 2.0
**Focus:** Regenerative Agricultural Intelligence & Agricultural Interoperability

---

<div align="center">

### AgriNexus

**From fragmented farm signals to transparent regenerative intelligence.**

</div>

from datetime import datetime, timedelta, timezone

import numpy as np
import planetary_computer
import rasterio
from pystac_client import Client
from rasterio.warp import transform


STAC_URL = "https://planetarycomputer.microsoft.com/api/stac/v1"
SENTINEL_COLLECTION = "sentinel-2-l2a"

# Sentinel-2 Scene Classification Layer values that we do not want
# to use for vegetation-index calculations.
INVALID_SCL_VALUES = {
    0,   # No data
    1,   # Saturated / defective
    3,   # Cloud shadow
    8,   # Cloud medium probability
    9,   # Cloud high probability
    10,  # Thin cirrus
    11,  # Snow / ice
}


def sample_asset(
    href: str,
    latitude: float,
    longitude: float,
) -> float | None:
    with rasterio.open(href) as dataset:
        xs, ys = transform(
            "EPSG:4326",
            dataset.crs,
            [longitude],
            [latitude],
        )

        sample = next(
            dataset.sample(
                [(xs[0], ys[0])],
                masked=True,
            )
        )[0]

        if np.ma.is_masked(sample):
            return None

        value = float(sample)

        if np.isnan(value):
            return None

        if dataset.nodata is not None and value == dataset.nodata:
            return None

        return value


def calculate_index(
    first_band: float,
    second_band: float,
) -> float | None:
    denominator = first_band + second_band

    if denominator == 0:
        return None

    return (first_band - second_band) / denominator


def get_satellite_signals(
    latitude: float,
    longitude: float,
):
    catalog = Client.open(
        STAC_URL,
        modifier=planetary_computer.sign_inplace,
    )

    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=60)

    # Small search area around the farm point.
    offset = 0.002

    bbox = [
        longitude - offset,
        latitude - offset,
        longitude + offset,
        latitude + offset,
    ]

    search = catalog.search(
        collections=[SENTINEL_COLLECTION],
        bbox=bbox,
        datetime=(
            f"{start_date.date().isoformat()}/"
            f"{end_date.date().isoformat()}"
        ),
        query={
            "eo:cloud_cover": {
                "lt": 80,
            }
        },
        max_items=20,
    )

    items = list(search.items())

    items.sort(
        key=lambda item: (
            item.datetime
            or datetime.min.replace(tzinfo=timezone.utc)
        ),
        reverse=True,
    )

    for item in items:
        required_assets = {
            "B04",
            "B08",
            "B11",
            "SCL",
        }

        if not required_assets.issubset(item.assets.keys()):
            continue

        scl = sample_asset(
            item.assets["SCL"].href,
            latitude,
            longitude,
        )

        if scl is None:
            continue

        scl_value = int(round(scl))

        if scl_value in INVALID_SCL_VALUES:
            continue

        red = sample_asset(
            item.assets["B04"].href,
            latitude,
            longitude,
        )

        nir = sample_asset(
            item.assets["B08"].href,
            latitude,
            longitude,
        )

        swir = sample_asset(
            item.assets["B11"].href,
            latitude,
            longitude,
        )

        if red is None or nir is None or swir is None:
            continue

        ndvi = calculate_index(
            nir,
            red,
        )

        ndmi = calculate_index(
            nir,
            swir,
        )

        if ndvi is None or ndmi is None:
            continue

        ndvi = round(ndvi, 3)
        ndmi = round(ndmi, 3)

        vegetation_health = round(
            max(
                0,
                min(
                    100,
                    ndvi * 100,
                ),
            )
        )

        observed_at = (
            item.datetime.isoformat()
            if item.datetime
            else None
        )

        return {
            "ndvi": ndvi,
            "ndmi": ndmi,
            "vegetation_health": vegetation_health,
            "observed_at": observed_at,
            "scene_id": item.id,
            "scene_cloud_cover": item.properties.get(
                "eo:cloud_cover"
            ),
            "scene_classification": scl_value,
            "source": "Sentinel-2 Level-2A",
            "provider": "Microsoft Planetary Computer",
            "is_live": True,
        }

    raise RuntimeError(
        "No usable cloud-free Sentinel-2 observation "
        "was found for this farm in the last 60 days."
    )
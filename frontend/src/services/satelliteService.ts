import { API_BASE_URL } from "../config"
import { auth } from "../firebase"

import { getAuthToken } from "./authService"
import { getFarmById } from "./farmService"


export type SatelliteData = {
  ndvi: number
  ndmi: number
  vegetation_health: number
  observed_at: string | null
  scene_id: string
  scene_cloud_cover: number | null
  scene_classification: number
  source: string
  provider: string
  is_live: boolean
}


export async function getFarmSatellite(
  farmId: string
): Promise<SatelliteData> {
  const token = await getAuthToken()

  if (auth.currentUser?.isAnonymous) {
    const farm = await getFarmById(farmId)

    if (!farm) {
      throw new Error(
        "Temporary guest farm could not be found"
      )
    }

    const response = await fetch(
      `${API_BASE_URL}/api/guest/satellite`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          latitude: farm.latitude,
          longitude: farm.longitude,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(
        "Could not load guest Sentinel-2 satellite data"
      )
    }

    const data = await response.json()

    return data.satellite
  }


  const response = await fetch(
    `${API_BASE_URL}/api/farms/${farmId}/satellite`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(
      "Could not load Sentinel-2 satellite data"
    )
  }

  const data = await response.json()

  return data.satellite
}

import { API_BASE_URL } from "../config"

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

type SatelliteResponse = {
  farm_id: string
  satellite: SatelliteData
}

export async function getFarmSatellite(
  farmId: string
): Promise<SatelliteData> {
  const response = await fetch(
    `${API_BASE_URL}/api/farms/${farmId}/satellite`
  )

  if (!response.ok) {
    throw new Error(
      "Could not load Sentinel-2 satellite data"
    )
  }

  const data: SatelliteResponse =
    await response.json()

  return data.satellite
}
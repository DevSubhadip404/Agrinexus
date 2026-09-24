import { API_BASE_URL } from "../config"
import { auth } from "../firebase"

import { getAuthToken } from "./authService"
import { getFarmById } from "./farmService"


export type AdvisoryInputCoverage = {
  farmer_input: boolean
  weather: boolean
  satellite: boolean
}


export type AdvisoryProvenance = {
  source: string
  data: string
  status: string
}


export type AdvisoryUncertainty = {
  satellite_included: boolean
  message: string
}


export type FarmExplanation = {
  farm_id: string
  language: string
  explanation: string
  model: string
  input_coverage: AdvisoryInputCoverage
  provenance: AdvisoryProvenance[]
  uncertainty: AdvisoryUncertainty
}


export async function getFarmExplanation(
  farmId: string,
  language: string
): Promise<FarmExplanation> {
  const token = await getAuthToken()

  if (auth.currentUser?.isAnonymous) {
    const farm = await getFarmById(farmId)

    if (!farm) {
      throw new Error(
        "Temporary guest farm could not be found"
      )
    }

    const response = await fetch(
      `${API_BASE_URL}/api/guest/explanation?language=${encodeURIComponent(
        language
      )}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          farm_id: farm.farm_id,
          crop: farm.crop,
          latitude: farm.latitude,
          longitude: farm.longitude,
          soil: farm.soil,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(
        "Could not generate guest farm explanation"
      )
    }

    return response.json()
  }


  const response = await fetch(
    `${API_BASE_URL}/api/farms/${farmId}/explanation?language=${encodeURIComponent(
      language
    )}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(
      "Could not generate farm explanation"
    )
  }

  return response.json()
}

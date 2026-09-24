import { API_BASE_URL } from "../config"

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
  const response = await fetch(
    `${API_BASE_URL}/api/farms/${farmId}/explanation?language=${encodeURIComponent(
      language
    )}`
  )

  if (!response.ok) {
    throw new Error("Could not generate farm explanation")
  }

  return response.json()
}

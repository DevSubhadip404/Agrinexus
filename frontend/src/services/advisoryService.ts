import { API_BASE_URL } from "../config"

export type AdvisoryResponse = {
  farm_id: string
  language: string
  explanation: string
  model: string
}

export async function getFarmExplanation(
  farmId: string,
  language: string
): Promise<AdvisoryResponse> {
  const params = new URLSearchParams({
    language,
  })

  const response = await fetch(
    `${API_BASE_URL}/api/farms/${farmId}/explanation?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error("Could not generate AI explanation")
  }

  return response.json()
}
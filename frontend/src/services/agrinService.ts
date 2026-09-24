import { API_BASE_URL } from "../config"

export type AgriNNode = {
  node_id: string
  country: string
  country_code: string
  status: string
  models: number
  datasets: number
  capabilities: string[]
}

export type AgriNModel = {
  model_id: string
  name: string
  country: string
  country_code: string
  crop: string
  category: string
  version: string
  schema: string
  license: string
  input_types: string[]
  output_type: string
  stac_compatible: boolean
}

export type ModelExchangeRequest = {
  model_id: string
  target_country: string
  target_crop: string
}

export type ModelExchangeResponse = {
  exchange_id: string
  source_node: {
    country: string
    country_code: string
  }
  target_context: {
    country: string
    crop: string
  }
  model: {
    model_id: string
    name: string
    version: string
    category: string
    schema: string
  }
  compatibility: {
    score: number
    status: string
    crop_match: boolean
    same_country: boolean
  }
  provenance: {
    provider: string
    license: string
    schema: string
    stac_compatible: boolean
  }
  adaptation_notes: string[]
  disclaimer: string
}

export async function getAgriNNodes(): Promise<AgriNNode[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/agrin/nodes`
  )

  if (!response.ok) {
    throw new Error("Could not load AgriN nodes")
  }

  const data = await response.json()

  return data.nodes
}

export async function getAgriNModels(): Promise<AgriNModel[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/agrin/models`
  )

  if (!response.ok) {
    throw new Error("Could not load AgriN models")
  }

  const data = await response.json()

  return data.models
}

export async function getAgriNModel(
  modelId: string
): Promise<AgriNModel> {
  const response = await fetch(
    `${API_BASE_URL}/api/agrin/models/${modelId}`
  )

  if (!response.ok) {
    throw new Error("Could not load AgriN model")
  }

  return response.json()
}

export async function exchangeAgriNModel(
  request: ModelExchangeRequest
): Promise<ModelExchangeResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/agrin/exchange`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  )

  if (!response.ok) {
    throw new Error("Could not evaluate model exchange")
  }

  return response.json()
}
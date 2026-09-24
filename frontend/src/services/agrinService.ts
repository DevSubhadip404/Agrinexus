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
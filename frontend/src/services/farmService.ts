import { API_BASE_URL, USE_MOCK_DATA } from "../config"

import {
  createFarm as createMockFarm,
  getFarmById as getMockFarmById,
  getFarms as getMockFarms,
} from "./mockFarmService"

import type { Farm } from "./mockFarmService"

export type CreateFarmInput = {
  crop: string
  area_acres: number
  latitude: number
  longitude: number

  soil: {
    ph: number
    nitrogen: string
    phosphorus: string
    potassium: string
    moisture: string
  }
}

export async function getFarms(): Promise<Farm[]> {
  if (USE_MOCK_DATA) {
    return getMockFarms()
  }

  const response = await fetch(
    `${API_BASE_URL}/api/farms`
  )

  if (!response.ok) {
    throw new Error("Could not load farms")
  }

  const data = await response.json()

  return data.farms
}

export async function getFarmById(
  farmId: string
): Promise<Farm | undefined> {
  if (USE_MOCK_DATA) {
    return getMockFarmById(farmId)
  }

  const response = await fetch(
    `${API_BASE_URL}/api/farms/${farmId}`
  )

  if (response.status === 404) {
    return undefined
  }

  if (!response.ok) {
    throw new Error("Could not load farm")
  }

  return response.json()
}

export async function createFarm(
  farm: CreateFarmInput
): Promise<Farm> {
  if (USE_MOCK_DATA) {
    return createMockFarm(farm)
  }

  const response = await fetch(
    `${API_BASE_URL}/api/farms`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(farm),
    }
  )

  if (!response.ok) {
    throw new Error("Could not create farm")
  }

  const data = await response.json()

  return data.farm
}
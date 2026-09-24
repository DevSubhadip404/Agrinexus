import { API_BASE_URL } from "../config"
import { auth } from "../firebase"
import type { Farm } from "../types/farm"

import { getAuthToken } from "./authService"


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


const GUEST_FARMS_KEY =
  "agrinexus_guest_farms"


function isGuestSession(): boolean {
  return auth.currentUser?.isAnonymous === true
}


function getGuestFarms(): Farm[] {
  const stored =
    sessionStorage.getItem(
      GUEST_FARMS_KEY
    )

  if (!stored) {
    return []
  }

  try {
    return JSON.parse(stored) as Farm[]
  } catch {
    return []
  }
}


function saveGuestFarms(
  farms: Farm[]
) {
  sessionStorage.setItem(
    GUEST_FARMS_KEY,
    JSON.stringify(farms)
  )
}


async function getAuthHeaders() {
  const token = await getAuthToken()

  return {
    Authorization: `Bearer ${token}`,
  }
}


export async function getFarms(): Promise<Farm[]> {
  if (isGuestSession()) {
    return getGuestFarms()
  }

  const response = await fetch(
    `${API_BASE_URL}/api/farms`,
    {
      headers: await getAuthHeaders(),
    }
  )

  if (!response.ok) {
    throw new Error(
      "Could not load farms"
    )
  }

  const data = await response.json()

  return data.farms
}


export async function getFarmById(
  farmId: string
): Promise<Farm | undefined> {
  if (isGuestSession()) {
    return getGuestFarms().find(
      (farm) =>
        farm.farm_id === farmId
    )
  }

  const response = await fetch(
    `${API_BASE_URL}/api/farms/${farmId}`,
    {
      headers: await getAuthHeaders(),
    }
  )

  if (response.status === 404) {
    return undefined
  }

  if (!response.ok) {
    throw new Error(
      "Could not load farm"
    )
  }

  return response.json()
}


export async function createFarm(
  farm: CreateFarmInput
): Promise<Farm> {
  if (isGuestSession()) {
    const guestFarm: Farm = {
      farm_id: crypto.randomUUID(),
      crop: farm.crop.trim(),
      area_acres: farm.area_acres,
      latitude: farm.latitude,
      longitude: farm.longitude,
      soil: {
        ph: farm.soil.ph,
        nitrogen: farm.soil.nitrogen,
        phosphorus: farm.soil.phosphorus,
        potassium: farm.soil.potassium,
        moisture: farm.soil.moisture,
      },
    }

    const farms = getGuestFarms()

    saveGuestFarms([
      ...farms,
      guestFarm,
    ])

    return guestFarm
  }

  const token = await getAuthToken()

  const response = await fetch(
    `${API_BASE_URL}/api/farms`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(farm),
    }
  )

  if (!response.ok) {
    throw new Error(
      "Could not create farm"
    )
  }

  const data = await response.json()

  return data.farm
}

import { API_BASE_URL } from "../config"
import { auth } from "../firebase"

import { getAuthToken } from "./authService"
import { getFarmById } from "./farmService"


export type WeatherData = {
  temperature: number | null
  humidity: number | null
  current_precipitation: number | null
  weather_code: number | null
  rain_probability: number | null
  rainfall_forecast_mm: number | null
  timezone: string | null
  source: string
}


export async function getFarmWeather(
  farmId: string
): Promise<WeatherData> {
  const token = await getAuthToken()

  if (auth.currentUser?.isAnonymous) {
    const farm = await getFarmById(farmId)

    if (!farm) {
      throw new Error(
        "Temporary guest farm could not be found"
      )
    }

    const response = await fetch(
      `${API_BASE_URL}/api/guest/weather`,
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
        "Could not load guest weather data"
      )
    }

    const data = await response.json()

    return data.weather
  }


  const response = await fetch(
    `${API_BASE_URL}/api/farms/${farmId}/weather`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(
      "Could not load weather data"
    )
  }

  const data = await response.json()

  return data.weather
}

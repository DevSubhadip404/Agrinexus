import { API_BASE_URL } from "../config"

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
  const response = await fetch(
    `${API_BASE_URL}/api/farms/${farmId}/weather`
  )

  if (!response.ok) {
    throw new Error("Could not load weather data")
  }

  const data = await response.json()

  return data.weather
}
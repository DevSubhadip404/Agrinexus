import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import Navbar from "../components/Navbar"
import { getFarmExplanation } from "../services/advisoryService"
import { getFarmById } from "../services/farmService"
import { getFieldSignals } from "../services/mockSignalService"
import {
  getFarmWeather,
  type WeatherData,
} from "../services/weatherService"
import type { Farm } from "../services/mockFarmService"

function AnalysisPage() {
  const { farmId } = useParams()

  const [farm, setFarm] = useState<Farm | undefined>()
  const [weather, setWeather] = useState<WeatherData | null>(null)

  const [language, setLanguage] = useState("English")

  const [aiExplanation, setAiExplanation] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState("")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [weatherFallback, setWeatherFallback] = useState(false)

  useEffect(() => {
    async function loadAnalysis() {
      if (!farmId) {
        setError("Farm not found.")
        setLoading(false)
        return
      }

      try {
        const farmData = await getFarmById(farmId)

        if (!farmData) {
          setError("Farm not found.")
          return
        }

        setFarm(farmData)

        try {
          const weatherData = await getFarmWeather(farmId)
          setWeather(weatherData)
        } catch (weatherError) {
          console.error(weatherError)
          setWeatherFallback(true)
        }
      } catch (err) {
        console.error(err)
        setError("Could not load farm analysis.")
      } finally {
        setLoading(false)
      }
    }

    loadAnalysis()
  }, [farmId])

  useEffect(() => {
    async function loadAIExplanation() {
      if (!farmId || !farm) {
        return
      }

      setAiLoading(true)
      setAiError("")

      try {
        const result = await getFarmExplanation(
          farmId,
          language
        )

        setAiExplanation(result.explanation)
      } catch (err) {
        console.error(err)

        setAiError(
          "AI explanation is temporarily unavailable."
        )
      } finally {
        setAiLoading(false)
      }
    }

    loadAIExplanation()
  }, [farmId, farm, language])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="p-10 text-gray-500">
          Loading farm intelligence...
        </div>
      </div>
    )
  }

  if (error || !farm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="p-10 text-red-600">
          {error || "Analysis not found."}
        </div>
      </div>
    )
  }

  const mockSignals = getFieldSignals(
    farm.latitude,
    farm.longitude
  )

  const satellite = mockSignals.satellite

  const temperature =
    weather?.temperature ??
    mockSignals.weather.temperature

  const humidity =
    weather?.humidity ??
    mockSignals.weather.humidity

  const rainProbability =
    weather?.rain_probability ??
    mockSignals.weather.rainProbability

  const rainfallForecastMm =
    weather?.rainfall_forecast_mm ??
    mockSignals.weather.rainfallForecastMm

  const recommendations = []

  if (farm.soil.nitrogen === "Low") {
    recommendations.push({
      type: "Soil Nitrogen",
      message:
        "Nitrogen levels are low. Consider legume rotation, compost, or other nitrogen-building practices.",
    })
  }

  if (farm.soil.moisture === "Low") {
    recommendations.push({
      type: "Water Management",
      message:
        "Soil moisture is low. Consider mulch or targeted irrigation to reduce crop stress.",
    })
  }

  if (farm.soil.moisture === "High") {
    recommendations.push({
      type: "Drainage",
      message:
        "Soil moisture is high. Avoid unnecessary irrigation and inspect the field for drainage issues.",
    })
  }

  if (farm.soil.ph < 6) {
    recommendations.push({
      type: "Soil pH",
      message:
        "The soil is relatively acidic. Consider testing whether lime application is appropriate for this crop.",
    })
  }

  if (farm.soil.ph > 7.5) {
    recommendations.push({
      type: "Soil pH",
      message:
        "The soil is relatively alkaline. Organic matter and crop-specific amendments may improve nutrient availability.",
    })
  }

  if (rainProbability >= 60) {
    recommendations.push({
      type: "Live Weather Advisory",
      message:
        `Rain probability is ${rainProbability}%. Consider delaying irrigation and reassessing after rainfall.`,
    })
  } else {
    recommendations.push({
      type: "Live Weather Advisory",
      message:
        `Rain probability is ${rainProbability}%. Monitor soil moisture before the next irrigation cycle.`,
    })
  }

  if (satellite.ndvi < 0.65) {
    recommendations.push({
      type: "Satellite Alert",
      message:
        "Vegetation signals suggest possible crop stress. Inspect the field for nutrient, moisture, or disease problems.",
    })
  }

  recommendations.push({
    type: "Regenerative Practice",
    message:
      "Use crop rotation, residue retention, and suitable cover crops to improve long-term soil health.",
  })

  const diseaseRisk =
    humidity >= 72 ||
    farm.soil.moisture === "High"
      ? "High"
      : humidity >= 65
        ? "Medium"
        : "Low"

  const confidence =
    weather && satellite.ndvi >= 0.65
      ? 91
      : weather
        ? 86
        : 78

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <Link
            to={`/farm/${farm.farm_id}`}
            className="text-sm font-semibold text-green-700"
          >
            ← Back to Farm
          </Link>

          <div className="mt-6">
            <p className="text-sm font-semibold tracking-widest text-green-700">
              AGRINEXUS
            </p>

            <h1 className="mt-2 text-3xl font-bold capitalize text-gray-900">
              {farm.crop} Farm Analysis
            </h1>

            <p className="mt-2 text-gray-600">
              Live weather, soil, satellite signals, and regenerative intelligence.
            </p>
          </div>

          {weatherFallback && (
            <div className="mt-6 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">
              Live weather is temporarily unavailable. AgriNexus is using
              fallback demo weather data.
            </div>
          )}

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Vegetation Health
              </p>

              <p className="mt-2 text-3xl font-bold text-green-700">
                {satellite.vegetationHealth}%
              </p>

              <p className="mt-2 text-sm text-gray-600">
                NDVI: {satellite.ndvi}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Vegetation Moisture
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {satellite.ndmi}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                NDMI signal
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Live Rain Probability
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {rainProbability}%
              </p>

              <p className="mt-2 text-sm text-gray-600">
                {rainfallForecastMm} mm forecast
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Disease Risk
              </p>

              <p className="mt-2 text-3xl font-bold text-yellow-600">
                {diseaseRisk}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                {temperature}°C · {humidity}% humidity
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Data Sources
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Signals used to generate this advisory.
                </p>
              </div>

              <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
                Confidence: {confidence}%
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-gray-200 p-5">
                <p className="font-semibold text-gray-900">
                  Satellite
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  NDVI and NDMI vegetation signals.
                </p>

                <p className="mt-3 text-xs font-semibold uppercase text-yellow-700">
                  Prototype
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-5">
                <p className="font-semibold text-gray-900">
                  Weather
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Live temperature, humidity, and rainfall forecast.
                </p>

                <p className="mt-3 text-xs font-semibold uppercase text-green-700">
                  {weather
                    ? `Live · ${weather.source}`
                    : "Fallback"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-5">
                <p className="font-semibold text-gray-900">
                  Soil
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  pH, nutrients, and moisture stored in Firestore.
                </p>

                <p className="mt-3 text-xs font-semibold uppercase text-green-700">
                  Connected
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-5">
                <p className="font-semibold text-gray-900">
                  Gemini AI
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Farmer-friendly multilingual explanation.
                </p>

                <p className="mt-3 text-xs font-semibold uppercase text-green-700">
                  Live
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Regenerative Recommendations
            </h2>

            <div className="mt-6 space-y-4">
              {recommendations.map((recommendation) => (
                <div
                  key={`${recommendation.type}-${recommendation.message}`}
                  className="rounded-xl bg-green-50 p-5"
                >
                  <p className="font-semibold text-green-800">
                    {recommendation.type}
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {recommendation.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-green-900 p-8 text-white shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-widest text-green-200">
                  GEMINI AI EXPLANATION
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  What does this mean?
                </h2>
              </div>

              <select
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value)
                }
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-900"
              >
                <option value="English">
                  English
                </option>

                <option value="Hindi">
                  हिन्दी
                </option>

                <option value="Telugu">
                  తెలుగు
                </option>
              </select>
            </div>

            {aiLoading && (
              <p className="mt-5 text-green-100">
                Gemini is generating your explanation...
              </p>
            )}

            {aiError && (
              <p className="mt-5 text-yellow-200">
                {aiError}
              </p>
            )}

            {!aiLoading && !aiError && aiExplanation && (
              <p className="mt-5 whitespace-pre-line leading-7 text-green-50">
                {aiExplanation}
              </p>
            )}

            <p className="mt-5 text-xs text-green-200">
              Generated from your farm data and live weather using Gemini.
              Satellite indicators are currently prototype signals.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisPage
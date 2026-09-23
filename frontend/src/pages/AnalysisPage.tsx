import { useState } from "react"
import { Link, useParams } from "react-router-dom"

import Navbar from "../components/Navbar"
import { getFarmById } from "../services/mockFarmService"
import { getFieldSignals } from "../services/mockSignalService"

function AnalysisPage() {
  const { farmId } = useParams()
  const [language, setLanguage] = useState("en")

  const farm = farmId
    ? getFarmById(farmId)
    : undefined

  if (!farm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="p-10">
          Analysis not found.
        </div>
      </div>
    )
  }

  const signals = getFieldSignals(
    farm.latitude,
    farm.longitude
  )

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

  if (signals.weather.rainProbability >= 60) {
    recommendations.push({
      type: "Weather Advisory",
      message:
        `Rain probability is ${signals.weather.rainProbability}%. Consider delaying irrigation until the forecast is reassessed.`,
    })
  } else {
    recommendations.push({
      type: "Weather Advisory",
      message:
        `Rain probability is only ${signals.weather.rainProbability}%. Monitor soil moisture before the next irrigation cycle.`,
    })
  }

  if (signals.satellite.ndvi < 0.65) {
    recommendations.push({
      type: "Satellite Alert",
      message:
        "Satellite vegetation signals suggest possible crop stress. Inspect the field for nutrient, moisture, or disease issues.",
    })
  }

  recommendations.push({
    type: "Regenerative Practice",
    message:
      "Use crop rotation, residue retention, and cover crops where suitable to improve long-term soil health.",
  })

  const diseaseRisk =
    signals.weather.humidity >= 72 ||
    farm.soil.moisture === "High"
      ? "High"
      : signals.weather.humidity >= 65
        ? "Medium"
        : "Low"

  const confidence =
    signals.satellite.ndvi >= 0.65
      ? 87
      : 79

  const explanations = {
    en: `Your ${farm.crop} farm has an NDVI of ${signals.satellite.ndvi} and an estimated vegetation health score of ${signals.satellite.vegetationHealth}%. Current temperature is ${signals.weather.temperature}°C with ${signals.weather.humidity}% humidity. Rain probability is ${signals.weather.rainProbability}%. Soil pH is ${farm.soil.ph} and nitrogen is ${farm.soil.nitrogen.toLowerCase()}. AgriNexus combines these field signals to generate regenerative recommendations.`,

    hi: `आपके ${farm.crop} खेत का NDVI ${signals.satellite.ndvi} है और अनुमानित वनस्पति स्वास्थ्य स्कोर ${signals.satellite.vegetationHealth}% है। वर्तमान तापमान ${signals.weather.temperature}°C और आर्द्रता ${signals.weather.humidity}% है। बारिश की संभावना ${signals.weather.rainProbability}% है। मिट्टी का pH ${farm.soil.ph} है और नाइट्रोजन स्तर ${farm.soil.nitrogen} है। AgriNexus इन संकेतों को मिलाकर पुनर्योजी कृषि सुझाव देता है।`,

    te: `మీ ${farm.crop} పొలానికి NDVI ${signals.satellite.ndvi} మరియు అంచనా వృక్ష ఆరోగ్య స్కోర్ ${signals.satellite.vegetationHealth}% ఉంది. ప్రస్తుతం ఉష్ణోగ్రత ${signals.weather.temperature}°C మరియు తేమ ${signals.weather.humidity}% ఉంది. వర్షం పడే అవకాశం ${signals.weather.rainProbability}%. నేల pH ${farm.soil.ph}, నైట్రోజన్ స్థాయి ${farm.soil.nitrogen}. AgriNexus ఈ సంకేతాలను కలిపి పునరుత్పాదక వ్యవసాయ సూచనలు అందిస్తుంది.`,
  }

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
              Satellite, weather, soil, and regenerative intelligence for this field.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Vegetation Health
              </p>

              <p className="mt-2 text-3xl font-bold text-green-700">
                {signals.satellite.vegetationHealth}%
              </p>

              <p className="mt-2 text-sm text-gray-600">
                NDVI: {signals.satellite.ndvi}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Vegetation Moisture
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {signals.satellite.ndmi}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                NDMI signal
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Rain Probability
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {signals.weather.rainProbability}%
              </p>

              <p className="mt-2 text-sm text-gray-600">
                {signals.weather.rainfallForecastMm} mm forecast
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
                {signals.weather.temperature}°C · {signals.weather.humidity}% humidity
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

                <p className="mt-3 text-xs font-semibold uppercase text-green-700">
                  Connected
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-5">
                <p className="font-semibold text-gray-900">
                  Weather
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Rainfall, temperature, and humidity.
                </p>

                <p className="mt-3 text-xs font-semibold uppercase text-green-700">
                  Connected
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-5">
                <p className="font-semibold text-gray-900">
                  Soil
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  pH, nutrients, and moisture.
                </p>

                <p className="mt-3 text-xs font-semibold uppercase text-green-700">
                  Connected
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-5">
                <p className="font-semibold text-gray-900">
                  AI Advisory
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Multi-signal regenerative recommendations.
                </p>

                <p className="mt-3 text-xs font-semibold uppercase text-yellow-700">
                  Prototype
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Field Signals
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Soil pH
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {farm.soil.ph}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Nitrogen
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {farm.soil.nitrogen}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Temperature
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {signals.weather.temperature}°C
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Humidity
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {signals.weather.humidity}%
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
                  AI EXPLANATION
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  What does this mean?
                </h2>
              </div>

              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-900"
              >
                <option value="en">
                  English
                </option>

                <option value="hi">
                  हिन्दी
                </option>

                <option value="te">
                  తెలుగు
                </option>
              </select>
            </div>

            <p className="mt-5 leading-7 text-green-50">
              {explanations[language as keyof typeof explanations]}
            </p>

            <p className="mt-5 text-xs text-green-200">
              Prototype data for now. Real satellite, weather, and AI services
              will replace the mock providers during backend integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisPage
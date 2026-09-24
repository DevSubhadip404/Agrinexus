import {
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { Link, useParams } from "react-router-dom"

import Navbar from "../components/Navbar"

import {
  getFarmExplanation,
  type FarmExplanation,
} from "../services/advisoryService"

import { getFarmById } from "../services/farmService"

import {
  getFarmSatellite,
  type SatelliteData,
} from "../services/satelliteService"

import {
  getFarmWeather,
  type WeatherData,
} from "../services/weatherService"

import type { Farm } from "../types/farm"


type SignalCardProps = {
  label: string
  value: ReactNode
  detail: ReactNode
  accentClass: string
  icon: ReactNode
  unavailable?: boolean
}


function SignalCard({
  label,
  value,
  detail,
  accentClass,
  icon,
  unavailable = false,
}: SignalCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-gray-500">
          {label}
        </p>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentClass}`}
        >
          {icon}
        </div>
      </div>

      {unavailable ? (
        <>
          <p className="mt-4 text-xl font-bold text-gray-400">
            Unavailable
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            {detail}
          </p>
        </>
      ) : (
        <>
          <div className="mt-4 text-3xl font-bold text-gray-900">
            {value}
          </div>

          <div className="mt-2 text-sm leading-6 text-gray-500">
            {detail}
          </div>
        </>
      )}
    </div>
  )
}


type SourceCardProps = {
  title: string
  description: string
  status: string
  available: boolean
  detail?: ReactNode
}


function SourceCard({
  title,
  description,
  status,
  available,
  detail,
}: SourceCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-bold text-gray-900">
          {title}
        </p>

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
            available
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {status}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        {description}
      </p>

      {detail && (
        <div className="mt-3 text-xs leading-5 text-gray-500">
          {detail}
        </div>
      )}
    </div>
  )
}


function AnalysisPage() {
  const { farmId } = useParams()

  const [farm, setFarm] = useState<Farm | undefined>()
  const [weather, setWeather] = useState<WeatherData | null>(
    null
  )
  const [satellite, setSatellite] =
    useState<SatelliteData | null>(null)

  const [language, setLanguage] = useState("English")

  const [aiExplanation, setAiExplanation] = useState("")
  const [advisoryData, setAdvisoryData] =
    useState<FarmExplanation | null>(null)

  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState("")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [weatherUnavailable, setWeatherUnavailable] =
    useState(false)

  const [satelliteUnavailable, setSatelliteUnavailable] =
    useState(false)


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
          const weatherData =
            await getFarmWeather(farmId)

          setWeather(weatherData)
          setWeatherUnavailable(false)
        } catch (weatherError) {
          console.error(weatherError)

          setWeather(null)
          setWeatherUnavailable(true)
        }

        try {
          const satelliteData =
            await getFarmSatellite(farmId)

          setSatellite(satelliteData)
          setSatelliteUnavailable(false)
        } catch (satelliteError) {
          console.error(satelliteError)

          setSatellite(null)
          setSatelliteUnavailable(true)
        }
      } catch (err) {
        console.error(err)

        setError(
          "Could not load farm analysis."
        )
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
      setAiExplanation("")
      setAdvisoryData(null)

      try {
        const result =
          await getFarmExplanation(
            farmId,
            language
          )

        setAiExplanation(result.explanation)
        setAdvisoryData(result)
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
      <div className="min-h-screen bg-[#f6f8f4]">
        <Navbar />

        <main className="px-6 py-10">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Loading farm intelligence...
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Retrieving farm, weather, and Sentinel-2 signals.
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }


  if (error || !farm) {
    return (
      <div className="min-h-screen bg-[#f6f8f4]">
        <Navbar />

        <main className="px-6 py-10">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-3xl border border-red-100 bg-red-50 p-8">
              <p className="font-semibold text-red-700">
                {error || "Analysis not found."}
              </p>

              <Link
                to="/dashboard"
                className="mt-4 inline-block text-sm font-semibold text-red-700"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }


  const temperature =
    weather?.temperature ?? null

  const humidity =
    weather?.humidity ?? null

  const rainProbability =
    weather?.rain_probability ?? null

  const rainfallForecastMm =
    weather?.rainfall_forecast_mm ?? null


  const recommendations: {
    type: string
    message: string
  }[] = []


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


  if (rainProbability !== null) {
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
  }


  if (
    satellite &&
    satellite.ndvi < 0.65
  ) {
    recommendations.push({
      type: "Sentinel-2 Vegetation Alert",
      message:
        "The current NDVI signal is relatively low against the prototype rule threshold. Inspect the field before drawing conclusions about crop condition.",
    })
  }


  if (
    satellite &&
    satellite.ndmi < 0.1
  ) {
    recommendations.push({
      type: "Sentinel-2 Moisture Alert",
      message:
        "The satellite moisture indicator is relatively low against the prototype rule threshold. Compare it with field soil moisture before changing irrigation.",
    })
  }


  recommendations.push({
    type: "Regenerative Practice",
    message:
      "Use crop rotation, residue retention, and suitable cover crops to support long-term soil function and resilience.",
  })


  let diseaseRisk = "Unavailable"

  if (humidity !== null) {
    diseaseRisk =
      humidity >= 72 ||
      farm.soil.moisture === "High"
        ? "High"
        : humidity >= 65
          ? "Medium"
          : "Low"
  }


  const availableSignalGroups = [
    true,
    weather !== null,
    satellite !== null,
  ].filter(Boolean).length

  const signalCoverage = Math.round(
    (availableSignalGroups / 3) * 100
  )


  const observedDate =
    satellite?.observed_at
      ? new Date(
          satellite.observed_at
        ).toLocaleDateString(
          "en-US",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        )
      : null


  const geminiSourceStatus =
    aiLoading
      ? "Generating"
      : aiError
        ? "Unavailable"
        : advisoryData
          ? "Connected"
          : "Pending"


  return (
    <div className="min-h-screen bg-[#f6f8f4]">
      <Navbar />

      <main className="px-6 py-10">
        <div className="mx-auto max-w-6xl">

          <Link
            to={`/farm/${farm.farm_id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-800"
          >
            ← Back to Farm
          </Link>


          <section className="mt-6 overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-white via-green-50/60 to-emerald-50 shadow-sm">
            <div className="p-8 md:p-10">
              <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-bold tracking-[0.24em] text-green-700">
                      AGRINEXUS FIELD INTELLIGENCE
                    </p>

                    <span className="rounded-full border border-green-200 bg-white px-3 py-1 text-xs font-semibold text-green-700">
                      Real-data analysis
                    </span>
                  </div>

                  <h1 className="mt-4 text-3xl font-bold capitalize tracking-tight text-gray-900 md:text-4xl">
                    {farm.crop} Farm Analysis
                  </h1>

                  <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                    Farmer-provided soil indicators are combined with live
                    weather and recent Sentinel-2 observations to support
                    transparent regenerative recommendations.
                  </p>
                </div>


                <div className="rounded-2xl border border-green-100 bg-white/80 p-5 shadow-sm backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                    Input Coverage
                  </p>

                  <div className="mt-2 flex items-end gap-2">
                    <p className="text-3xl font-bold text-green-700">
                      {signalCoverage}%
                    </p>

                    <span className="pb-1 text-xs text-gray-400">
                      available
                    </span>
                  </div>

                  <div className="mt-3 flex gap-1.5">
                    <span
                      className="h-2 flex-1 rounded-full bg-green-500"
                      title="Soil"
                    />

                    <span
                      className={`h-2 flex-1 rounded-full ${
                        weather
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                      title="Weather"
                    />

                    <span
                      className={`h-2 flex-1 rounded-full ${
                        satellite
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                      title="Sentinel-2"
                    />
                  </div>

                  <p className="mt-3 text-[11px] leading-4 text-gray-400">
                    Availability coverage, not prediction accuracy.
                  </p>
                </div>
              </div>


              <div className="mt-8 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm">
                  Soil · Available
                </span>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
                    weather
                      ? "bg-white text-gray-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {weather?.source || "Weather Provider"} ·{" "}
                  {weather
                    ? "Live"
                    : "Unavailable"}
                </span>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
                    satellite
                      ? "bg-white text-gray-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  Sentinel-2 ·{" "}
                  {satellite
                    ? observedDate || "Available"
                    : "Unavailable"}
                </span>
              </div>
            </div>
          </section>


          {weatherUnavailable && (
            <div className="mt-6 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
                !
              </div>

              <div>
                <p className="font-semibold">
                  Live weather unavailable
                </p>

                <p className="mt-1 leading-6 text-red-600">
                  No demo or simulated weather values are being substituted.
                </p>
              </div>
            </div>
          )}


          {satelliteUnavailable && (
            <div className="mt-4 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
                !
              </div>

              <div>
                <p className="font-semibold">
                  Sentinel-2 observation unavailable
                </p>

                <p className="mt-1 leading-6 text-red-600">
                  No usable recent observation was found. Simulated satellite
                  values are not substituted.
                </p>
              </div>
            </div>
          )}


          <section className="mt-8">
            <div className="mb-5">
              <p className="text-xs font-bold tracking-[0.22em] text-green-700">
                FIELD SIGNALS
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                Current evidence
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Measurements and indicators currently available for this farm.
              </p>
            </div>


            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <SignalCard
                label="Vegetation Index"
                unavailable={!satellite}
                value={
                  satellite
                    ? satellite.ndvi.toFixed(3)
                    : ""
                }
                detail={
                  satellite
                    ? "Sentinel-2 NDVI"
                    : "No recent usable Sentinel-2 observation."
                }
                accentClass="bg-green-100 text-green-700"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path d="M12 21V10" />
                    <path d="M12 13c-4 0-7-2-7-6 4 0 7 2 7 6z" />
                    <path d="M12 10c0-4 3-6 7-6 0 4-3 6-7 6z" />
                  </svg>
                }
              />


              <SignalCard
                label="Vegetation Moisture"
                unavailable={!satellite}
                value={
                  satellite
                    ? satellite.ndmi.toFixed(3)
                    : ""
                }
                detail={
                  satellite
                    ? "Sentinel-2 NDMI"
                    : "No recent usable Sentinel-2 observation."
                }
                accentClass="bg-blue-100 text-blue-700"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path d="M12 3s5 5.4 5 10a5 5 0 0 1-10 0c0-4.6 5-10 5-10z" />
                  </svg>
                }
              />


              <SignalCard
                label="Rain Probability"
                unavailable={
                  rainProbability === null
                }
                value={
                  rainProbability !== null
                    ? `${rainProbability}%`
                    : ""
                }
                detail={
                  rainProbability !== null
                    ? rainfallForecastMm !== null
                      ? `${rainfallForecastMm} mm forecast`
                      : "Rainfall amount unavailable"
                    : "Live weather signal unavailable."
                }
                accentClass="bg-cyan-100 text-cyan-700"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path d="M7 16a4 4 0 1 1 1-7.87A5 5 0 0 1 17.9 10H18a3 3 0 0 1 0 6H7z" />
                    <path d="M9 19l-1 2" />
                    <path d="M14 19l-1 2" />
                  </svg>
                }
              />


              <SignalCard
                label="Weather-based Disease Risk"
                unavailable={
                  diseaseRisk === "Unavailable"
                }
                value={diseaseRisk}
                detail={
                  temperature !== null &&
                  humidity !== null
                    ? `${temperature}°C · ${humidity}% humidity · heuristic indicator`
                    : "Requires live humidity data."
                }
                accentClass="bg-amber-100 text-amber-700"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path d="M12 3l9 17H3L12 3z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                }
              />
            </div>
          </section>


          <section className="mt-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.22em] text-green-700">
                  DATA PROVENANCE
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  Evidence sources
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  Only available real-world signals are used. Missing external
                  sources remain explicitly unavailable.
                </p>
              </div>

              <div className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-800">
                Input Coverage · {signalCoverage}%
              </div>
            </div>


            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SourceCard
                title="Sentinel-2"
                description="NDVI and NDMI derived from Sentinel-2 Level-2A imagery."
                available={satellite !== null}
                status={
                  satellite
                    ? "Available"
                    : "Unavailable"
                }
                detail={
                  satellite ? (
                    <>
                      <p>
                        {satellite.provider}
                      </p>

                      {observedDate && (
                        <p className="mt-1">
                          Observed {observedDate}
                        </p>
                      )}
                    </>
                  ) : undefined
                }
              />


              <SourceCard
                title={weather?.source || "Weather Provider"}
                description="Live temperature, humidity, and rainfall forecast signals."
                available={weather !== null}
                status={
                  weather
                    ? "Live"
                    : "Unavailable"
                }
                detail={
                  weather ? (
                    <p>
                      Source: {weather.source}
                    </p>
                  ) : undefined
                }
              />


              <SourceCard
                title="Farm Inputs"
                description="Farmer-provided pH, nutrient, and moisture indicators stored with the farm profile."
                available={true}
                status="Available"
                detail={
                  <p>
                    Storage: Firestore
                  </p>
                }
              />


              <SourceCard
                title="Gemini"
                description="Multilingual interpretation of the available farm evidence."
                available={!aiError}
                status={geminiSourceStatus}
                detail={
                  <p>
                    AI interpretation is separated from measured source data.
                  </p>
                }
              />
            </div>


            {satellite && (
              <div className="mt-7 overflow-hidden rounded-2xl border border-blue-100 bg-blue-50/70">
                <div className="border-b border-blue-100 px-6 py-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold tracking-[0.18em] text-blue-600">
                        SENTINEL-2 OBSERVATION
                      </p>

                      <h3 className="mt-1 font-bold text-blue-950">
                        Satellite observation details
                      </h3>
                    </div>

                    <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700">
                      Level-2A
                    </span>
                  </div>
                </div>


                <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      NDVI
                    </p>

                    <p className="mt-2 text-xl font-bold text-blue-950">
                      {satellite.ndvi.toFixed(3)}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      NDMI
                    </p>

                    <p className="mt-2 text-xl font-bold text-blue-950">
                      {satellite.ndmi.toFixed(3)}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      Scene-wide Cloud Cover
                    </p>

                    <p className="mt-2 text-xl font-bold text-blue-950">
                      {satellite.scene_cloud_cover !== null
                        ? `${satellite.scene_cloud_cover.toFixed(1)}%`
                        : "Unknown"}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      Observation Date
                    </p>

                    <p className="mt-2 text-xl font-bold text-blue-950">
                      {observedDate || "Unknown"}
                    </p>
                  </div>
                </div>


                <div className="border-t border-blue-100 px-6 py-4">
                  <p className="text-xs text-blue-700">
                    Scene ID
                  </p>

                  <p className="mt-1 break-all font-mono text-[11px] leading-5 text-blue-900">
                    {satellite.scene_id}
                  </p>
                </div>
              </div>
            )}
          </section>


          <section className="mt-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <div>
              <p className="text-xs font-bold tracking-[0.22em] text-green-700">
                REGENERATIVE INTELLIGENCE
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                Recommended actions
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Transparent rule-based suggestions derived from the currently
                available farm, weather, and satellite inputs.
              </p>
            </div>


            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {recommendations.map(
                (
                  recommendation,
                  index
                ) => (
                  <article
                    key={`${recommendation.type}-${recommendation.message}`}
                    className="rounded-2xl border border-green-100 bg-green-50/60 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white">
                        {index + 1}
                      </div>

                      <div>
                        <p className="font-bold text-green-900">
                          {recommendation.type}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-gray-700">
                          {recommendation.message}
                        </p>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          </section>


          <section className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-green-950 via-green-900 to-emerald-900 text-white shadow-lg">
            <div className="p-8 md:p-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-bold tracking-[0.22em] text-green-300">
                      GEMINI ADVISORY
                    </p>

                    <span className="rounded-full border border-green-700 bg-green-950/40 px-3 py-1 text-xs font-semibold text-green-100">
                      AI interpretation
                    </span>
                  </div>

                  <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                    What does this evidence mean?
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-green-100">
                    Gemini translates the available farm evidence into a
                    farmer-friendly explanation while preserving provenance and
                    uncertainty.
                  </p>
                </div>


                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-green-300">
                    Language
                  </label>

                  <select
                    value={language}
                    onChange={(event) =>
                      setLanguage(
                        event.target.value
                      )
                    }
                    className="min-w-36 rounded-xl border border-green-700 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 outline-none"
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
              </div>


              {aiLoading && (
                <div className="mt-8 rounded-2xl border border-green-700 bg-green-950/30 p-5">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-300" />

                    <p className="text-sm font-medium text-green-100">
                      Gemini is interpreting the available farm evidence...
                    </p>
                  </div>
                </div>
              )}


              {aiError && (
                <div className="mt-8 rounded-2xl border border-yellow-300/30 bg-yellow-300/10 p-5">
                  <p className="font-semibold text-yellow-100">
                    AI explanation unavailable
                  </p>

                  <p className="mt-2 text-sm text-yellow-100/80">
                    {aiError}
                  </p>
                </div>
              )}


              {!aiLoading &&
                !aiError &&
                aiExplanation && (
                  <div className="mt-8 rounded-2xl border border-green-700 bg-green-950/35 p-6">
                    <p className="whitespace-pre-line leading-8 text-green-50">
                      {aiExplanation}
                    </p>
                  </div>
                )}


              {!aiLoading &&
                !aiError &&
                advisoryData && (
                  <div className="mt-8 border-t border-green-700 pt-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold tracking-[0.2em] text-green-300">
                          ADVISORY TRANSPARENCY
                        </p>

                        <h3 className="mt-2 text-xl font-bold">
                          Input Coverage & Provenance
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-green-700 bg-green-950/40 px-3 py-2 text-xs font-semibold text-green-100">
                          Farmer Input ·{" "}
                          {advisoryData.input_coverage.farmer_input
                            ? "Available"
                            : "Unavailable"}
                        </span>

                        <span className="rounded-full border border-green-700 bg-green-950/40 px-3 py-2 text-xs font-semibold text-green-100">
                          Weather ·{" "}
                          {advisoryData.input_coverage.weather
                            ? "Available"
                            : "Unavailable"}
                        </span>

                        <span className="rounded-full border border-green-700 bg-green-950/40 px-3 py-2 text-xs font-semibold text-green-100">
                          Satellite ·{" "}
                          {advisoryData.input_coverage.satellite
                            ? "Available"
                            : "Unavailable"}
                        </span>
                      </div>
                    </div>


                    <p className="mt-3 text-xs leading-5 text-green-200">
                      These indicators show which evidence sources were
                      available to the advisory. They do not represent AI
                      accuracy or prediction confidence.
                    </p>


                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {advisoryData.provenance.map(
                        (item) => (
                          <div
                            key={`${item.source}-${item.data}`}
                            className="rounded-2xl border border-green-700 bg-green-950/40 p-5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <p className="font-bold text-white">
                                {item.source}
                              </p>

                              <span className="rounded-full bg-green-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green-100">
                                {item.status}
                              </span>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-green-100">
                              {item.data}
                            </p>
                          </div>
                        )
                      )}
                    </div>


                    <div className="mt-6 rounded-2xl border border-yellow-300/30 bg-yellow-300/10 p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-bold tracking-[0.18em] text-yellow-200">
                            UNCERTAINTY NOTICE
                          </p>

                          <p className="mt-2 max-w-3xl text-sm leading-6 text-green-50">
                            {
                              advisoryData
                                .uncertainty
                                .message
                            }
                          </p>
                        </div>

                        <span
                          className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            advisoryData
                              .uncertainty
                              .satellite_included
                              ? "bg-green-800 text-green-100"
                              : "bg-yellow-200/20 text-yellow-100"
                          }`}
                        >
                          Satellite ·{" "}
                          {advisoryData
                            .uncertainty
                            .satellite_included
                            ? "Included"
                            : "Not included"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}


              <div className="mt-7 flex flex-wrap gap-2 border-t border-green-800 pt-6">
                <span className="rounded-full bg-green-950/40 px-3 py-1.5 text-xs font-medium text-green-200">
                  Farmer inputs
                </span>

                <span className="rounded-full bg-green-950/40 px-3 py-1.5 text-xs font-medium text-green-200">
                  {weather?.source || "Weather Provider"}
                </span>

                <span className="rounded-full bg-green-950/40 px-3 py-1.5 text-xs font-medium text-green-200">
                  Sentinel-2
                </span>

                <span className="rounded-full bg-green-950/40 px-3 py-1.5 text-xs font-medium text-green-200">
                  Missing sources remain unavailable
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}


export default AnalysisPage
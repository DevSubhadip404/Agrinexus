import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import Navbar from "../components/Navbar"
import { getFarmById } from "../services/farmService"
import type { Farm } from "../types/farm"


function FarmPage() {
  const { farmId } = useParams()

  const [farm, setFarm] = useState<Farm | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")


  useEffect(() => {
    async function loadFarm() {
      if (!farmId) {
        setError("Farm not found.")
        setLoading(false)
        return
      }

      try {
        const data = await getFarmById(farmId)

        if (!data) {
          setError("Farm not found.")
          return
        }

        setFarm(data)
      } catch (err) {
        console.error(err)
        setError("Could not load farm.")
      } finally {
        setLoading(false)
      }
    }

    loadFarm()
  }, [farmId])


  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8f4]">
        <Navbar />

        <main className="px-6 py-10">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-sm">
              <p className="text-sm text-gray-500">
                Loading farm profile...
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
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl border border-red-100 bg-red-50 p-8">
              <p className="font-semibold text-red-700">
                {error || "Farm not found."}
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


  const soilIndicators = [
    {
      label: "pH",
      value: farm.soil.ph,
      description: "Soil acidity",
      accent: "bg-green-100 text-green-700",
    },
    {
      label: "Nitrogen",
      value: farm.soil.nitrogen,
      description: "N indicator",
      accent: "bg-blue-100 text-blue-700",
    },
    {
      label: "Phosphorus",
      value: farm.soil.phosphorus,
      description: "P indicator",
      accent: "bg-amber-100 text-amber-700",
    },
    {
      label: "Potassium",
      value: farm.soil.potassium,
      description: "K indicator",
      accent: "bg-purple-100 text-purple-700",
    },
    {
      label: "Moisture",
      value: farm.soil.moisture,
      description: "Soil moisture",
      accent: "bg-cyan-100 text-cyan-700",
    },
  ]


  return (
    <div className="min-h-screen bg-[#f6f8f4]">
      <Navbar />

      <main className="px-6 py-10">
        <div className="mx-auto max-w-5xl">

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-800"
          >
            ← Back to Dashboard
          </Link>


          <section className="mt-6 overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-white via-green-50/40 to-emerald-50 shadow-sm">
            <div className="p-8 md:p-10">

              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-bold tracking-[0.24em] text-green-700">
                      FARM PROFILE
                    </p>

                    <span className="rounded-full border border-green-200 bg-white px-3 py-1 text-xs font-semibold text-green-700">
                      Firestore
                    </span>
                  </div>

                  <h1 className="mt-4 text-4xl font-bold capitalize tracking-tight text-gray-900 md:text-5xl">
                    {farm.crop}
                  </h1>

                  <p className="mt-3 max-w-xl leading-7 text-gray-600">
                    Saved farm profile used as the foundation for soil,
                    weather, satellite, and AI-assisted field analysis.
                  </p>
                </div>


                <Link
                  to={`/farm/${farm.farm_id}/analysis`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-md"
                >
                  Analyze Farm

                  <span>
                    →
                  </span>
                </Link>
              </div>


              <div className="mt-10 grid gap-4 sm:grid-cols-3">

                <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">
                      Farm Area
                    </p>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-700">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                      >
                        <path d="M4 19c4-6 8-8 16-8" />
                        <path d="M7 19c0-5 2-9 7-13" />
                      </svg>
                    </div>
                  </div>

                  <p className="mt-4 text-2xl font-bold text-gray-900">
                    {farm.area_acres}
                  </p>

                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Acres
                  </p>
                </div>


                <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">
                      Latitude
                    </p>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                      >
                        <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11z" />
                        <circle cx="12" cy="10" r="2" />
                      </svg>
                    </div>
                  </div>

                  <p className="mt-4 break-all text-xl font-bold text-gray-900">
                    {farm.latitude}
                  </p>

                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Farm coordinate
                  </p>
                </div>


                <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">
                      Longitude
                    </p>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                      >
                        <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11z" />
                        <circle cx="12" cy="10" r="2" />
                      </svg>
                    </div>
                  </div>

                  <p className="mt-4 break-all text-xl font-bold text-gray-900">
                    {farm.longitude}
                  </p>

                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Farm coordinate
                  </p>
                </div>
              </div>
            </div>
          </section>


          <section className="mt-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm md:p-10">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.22em] text-green-700">
                  FARM INPUTS
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  Soil Indicators
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  Farmer-provided soil measurements used as inputs for
                  regenerative recommendations and field analysis.
                </p>
              </div>

              <span className="w-fit rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
                Saved data
              </span>
            </div>


            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {soilIndicators.map((indicator) => (
                <div
                  key={indicator.label}
                  className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 transition hover:border-green-200 hover:bg-green-50/40"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${indicator.accent}`}
                  >
                    {indicator.label === "Nitrogen"
                      ? "N"
                      : indicator.label === "Phosphorus"
                        ? "P"
                        : indicator.label === "Potassium"
                          ? "K"
                          : indicator.label === "Moisture"
                            ? "%"
                            : "pH"}
                  </div>

                  <p className="mt-4 text-sm font-medium text-gray-500">
                    {indicator.label}
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {indicator.value}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {indicator.description}
                  </p>
                </div>
              ))}
            </div>


            <div className="mt-8 rounded-2xl bg-green-950 p-6 text-white">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="max-w-xl">
                  <p className="text-xs font-bold tracking-[0.2em] text-green-300">
                    MULTI-SIGNAL ANALYSIS
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    Inspect live field conditions
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-green-100">
                    Combine this farm profile with live Open-Meteo weather,
                    Sentinel-2 observations, and regenerative advisory logic.
                  </p>
                </div>

                <Link
                  to={`/farm/${farm.farm_id}/analysis`}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-green-900 transition hover:bg-green-50"
                >
                  Analyze Farm
                  <span>→</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}


export default FarmPage
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import Navbar from "../components/Navbar"
import {
  getAgriNModels,
  getAgriNNodes,
} from "../services/agrinService"
import { getFarms } from "../services/farmService"
import type { Farm } from "../types/farm"


function DashboardPage() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [nodeCount, setNodeCount] = useState<number | null>(null)
  const [modelCount, setModelCount] = useState<number | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")


  useEffect(() => {
    async function loadDashboard() {
      setLoading(true)
      setError("")

      try {
        const farmData = await getFarms()
        setFarms(farmData)
      } catch (err) {
        console.error(err)
        setError("Could not load farms.")
      }

      try {
        const [nodes, models] = await Promise.all([
          getAgriNNodes(),
          getAgriNModels(),
        ])

        setNodeCount(nodes.length)
        setModelCount(models.length)
      } catch (err) {
        console.error(
          "Could not load AgriN registry:",
          err
        )

        setNodeCount(null)
        setModelCount(null)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])


  return (
    <div className="min-h-screen bg-[#f6f8f4]">
      <Navbar />

      <main className="px-6 py-10">
        <div className="mx-auto max-w-6xl">

          <section className="overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-white via-green-50/50 to-emerald-50 p-8 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold tracking-[0.24em] text-green-700">
                  AGRINEXUS FIELD INTELLIGENCE
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                  Farm Dashboard
                </h1>

                <p className="mt-3 max-w-xl leading-7 text-gray-600">
                  Monitor registered farms, inspect field conditions, and access
                  satellite, weather, and AI-assisted agricultural intelligence.
                </p>
              </div>

              <Link
                to="/add-farm"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-md"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>

                Add Farm
              </Link>
            </div>
          </section>


          <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Farms
                  </p>

                  <p className="mt-3 text-3xl font-bold text-gray-900">
                    {loading ? "—" : farms.length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                  >
                    <path d="M4 19c4-6 8-8 16-8" />
                    <path d="M7 19c0-5 2-9 7-13" />
                    <path d="M12 5c3 0 5 2 5 5-3 0-5-2-5-5z" />
                  </svg>
                </div>
              </div>

              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-400">
                Firestore
              </p>
            </div>


            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Prototype Nodes
                  </p>

                  <p className="mt-3 text-3xl font-bold text-green-700">
                    {nodeCount ?? "—"}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                  >
                    <circle cx="6" cy="12" r="2" />
                    <circle cx="18" cy="6" r="2" />
                    <circle cx="18" cy="18" r="2" />
                    <path d="M8 11l8-4" />
                    <path d="M8 13l8 4" />
                  </svg>
                </div>
              </div>

              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-400">
                AgriN Commons
              </p>
            </div>


            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Registry Models
                  </p>

                  <p className="mt-3 text-3xl font-bold text-blue-600">
                    {modelCount ?? "—"}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                  >
                    <path d="M4 6l8-3 8 3-8 3-8-3z" />
                    <path d="M4 12l8 3 8-3" />
                    <path d="M4 17l8 3 8-3" />
                  </svg>
                </div>
              </div>

              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-400">
                Interoperable metadata
              </p>
            </div>


            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Analysis Sources
                  </p>

                  <p className="mt-3 text-3xl font-bold text-purple-600">
                    3
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 3v3" />
                    <path d="M12 18v3" />
                    <path d="M3 12h3" />
                    <path d="M18 12h3" />
                    <path d="M5.6 5.6l2.1 2.1" />
                    <path d="M16.3 16.3l2.1 2.1" />
                  </svg>
                </div>
              </div>

              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-400">
                Soil · Weather · Sentinel-2
              </p>
            </div>
          </section>


          <section className="mt-8 grid gap-5 lg:grid-cols-2">

            <Link
              to="/crop-doctor"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-950 to-green-800 p-7 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-green-500/10" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-[0.22em] text-green-200">
                    CROP DOCTOR
                  </p>

                  <span className="text-green-300 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-bold">
                  Diagnose crop issues
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-green-100">
                  Upload a crop image for an AI-assisted visual assessment
                  with explicit uncertainty handling.
                </p>

                <div className="mt-6 inline-flex rounded-full border border-green-600/50 bg-green-900/40 px-3 py-1.5 text-xs font-semibold text-green-100">
                  Gemini Vision
                </div>
              </div>
            </Link>


            <Link
              to="/agrin-commons"
              className="group relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50 to-slate-50 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-400/10" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-[0.22em] text-green-700">
                    AGRIN OPEN
                  </p>

                  <span className="text-green-700 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  Explore AgriN Commons
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-gray-600">
                  Explore the prototype registry of interoperable agricultural
                  models and cross-country exchange metadata.
                </p>

                <div className="mt-6 inline-flex rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-green-700">
                  Interoperability Layer
                </div>
              </div>
            </Link>
          </section>


          <section className="mt-12">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.22em] text-green-700">
                  REGISTERED FARMS
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  My Farms
                </h2>
              </div>

              <span className="text-sm text-gray-500">
                {farms.length}{" "}
                {farms.length === 1 ? "farm" : "farms"}
              </span>
            </div>


            {loading && (
              <p className="mt-6 text-sm text-gray-500">
                Loading farms...
              </p>
            )}


            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}


            {!loading && !error && farms.length === 0 && (
              <div className="mt-6 rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                  +
                </div>

                <p className="mt-4 font-semibold text-gray-900">
                  No farms yet
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Add your first farm to begin field analysis.
                </p>

                <Link
                  to="/add-farm"
                  className="mt-5 inline-block font-semibold text-green-700"
                >
                  Add Farm →
                </Link>
              </div>
            )}


            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {farms.map((farm) => (
                <article
                  key={farm.farm_id}
                  className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
                        {farm.crop}
                      </span>

                      <h3 className="mt-4 text-2xl font-bold text-gray-900">
                        {farm.area_acres} acres
                      </h3>
                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                      Saved Farm
                    </span>
                  </div>

                  <div className="mt-5 rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Coordinates
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {farm.latitude}, {farm.longitude}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">
                      Firestore
                    </span>

                    <Link
                      to={`/farm/${farm.farm_id}`}
                      className="font-semibold text-green-700 transition hover:text-green-800"
                    >
                      View Farm →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}


export default DashboardPage
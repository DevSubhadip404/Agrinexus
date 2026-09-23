import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import Navbar from "../components/Navbar"
import { getFarms } from "../services/farmService"
import type { Farm } from "../services/mockFarmService"

function DashboardPage() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadFarms() {
      try {
        const data = await getFarms()
        setFarms(data)
      } catch (err) {
        console.error(err)
        setError("Could not load farms.")
      } finally {
        setLoading(false)
      }
    }

    loadFarms()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-widest text-green-700">
                AGRINEXUS
              </p>

              <h1 className="mt-2 text-3xl font-bold text-gray-900">
                Farm Dashboard
              </h1>

              <p className="mt-2 text-gray-600">
                Monitor farms, analyze field conditions, and access AI-powered
                agricultural intelligence.
              </p>
            </div>

            <Link
              to="/add-farm"
              className="rounded-xl bg-green-700 px-5 py-3 text-center font-semibold text-white hover:bg-green-800"
            >
              Add Farm
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Total Farms
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {farms.length}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Average Health
              </p>

              <p className="mt-2 text-3xl font-bold text-green-700">
                76%
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Active Alerts
              </p>

              <p className="mt-2 text-3xl font-bold text-yellow-600">
                2
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Shared Models
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                27
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Link
              to="/crop-doctor"
              className="rounded-2xl bg-green-900 p-6 text-white shadow-sm hover:bg-green-800"
            >
              <p className="text-sm font-semibold tracking-widest text-green-200">
                CROP DOCTOR
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Diagnose crop issues
              </h2>

              <p className="mt-2 text-sm text-green-100">
                Upload a crop image and receive an AI-assisted diagnosis.
              </p>
            </Link>

            <Link
              to="/agrin-commons"
              className="rounded-2xl bg-white p-6 shadow-sm hover:bg-green-50"
            >
              <p className="text-sm font-semibold tracking-widest text-green-700">
                AGRIN OPEN
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                Explore AgriN Commons
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Discover shared agricultural datasets and AI models across
                participating nodes.
              </p>
            </Link>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                My Farms
              </h2>

              <span className="text-sm text-gray-500">
                {farms.length} farms
              </span>
            </div>

            {loading && (
              <p className="mt-6 text-sm text-gray-500">
                Loading farms...
              </p>
            )}

            {error && (
              <p className="mt-6 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            {!loading && !error && farms.length === 0 && (
              <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
                <p className="font-semibold text-gray-900">
                  No farms yet
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Add your first farm to begin analysis.
                </p>
              </div>
            )}

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {farms.map((farm) => (
                <div
                  key={farm.farm_id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <p className="text-sm font-semibold uppercase text-green-700">
                    {farm.crop}
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-gray-900">
                    {farm.area_acres} acres
                  </h3>

                  <p className="mt-3 text-sm text-gray-600">
                    {farm.latitude}, {farm.longitude}
                  </p>

                  <Link
                    to={`/farm/${farm.farm_id}`}
                    className="mt-5 inline-block font-semibold text-green-700"
                  >
                    View Farm →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
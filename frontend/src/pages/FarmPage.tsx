import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

const API_BASE_URL = "http://10.124.251.50:8000"

type Farm = {
  farm_id: string
  crop: string
  area_acres: number
  latitude: number
  longitude: number
}

function FarmPage() {
  const { farmId } = useParams()

  const [farm, setFarm] = useState<Farm | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFarm() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/farms/${farmId}`
        )

        if (!response.ok) {
          throw new Error("Farm not found")
        }

        const data = await response.json()

        setFarm(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadFarm()
  }, [farmId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        Loading farm...
      </div>
    )
  }

  if (!farm) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        Farm not found.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/dashboard"
          className="text-sm font-semibold text-green-700"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold tracking-widest text-green-700">
            FARM PROFILE
          </p>

          <h1 className="mt-2 text-4xl font-bold capitalize text-gray-900">
            {farm.crop}
          </h1>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <div className="rounded-xl bg-green-50 p-5">
              <p className="text-sm text-gray-500">
                Area
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {farm.area_acres} acres
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-5">
              <p className="text-sm text-gray-500">
                Latitude
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {farm.latitude}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-5">
              <p className="text-sm text-gray-500">
                Longitude
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {farm.longitude}
              </p>
            </div>
          </div>

          <button className="mt-8 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white">
            Analyze Farm
          </button>
        </div>
      </div>
    </div>
  )
}

export default FarmPage
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const API_BASE_URL = "http://10.124.251.50:8000"

type Farm = {
  farm_id: string
  crop: string
  area_acres: number
  latitude: number
  longitude: number
}

function DashboardPage() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFarms() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/farms`)
        const data = await response.json()

        setFarms(data.farms)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadFarms()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold tracking-widest text-green-700">
              AGRINEXUS
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Farm Dashboard
            </h1>
          </div>

          <Link
            to="/add-farm"
            className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white"
          >
            Add Farm
          </Link>
        </div>

        <div className="mt-10">
          {loading ? (
            <p>Loading farms...</p>
          ) : farms.length === 0 ? (
            <p>No farms added yet.</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {farms.map((farm) => (
                <div
                  key={farm.farm_id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <p className="text-sm font-semibold uppercase text-green-700">
                    {farm.crop}
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    {farm.area_acres} acres
                  </h2>

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
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
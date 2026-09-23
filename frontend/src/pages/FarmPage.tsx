import { Link, useParams } from "react-router-dom"

import Navbar from "../components/Navbar"
import { getFarmById } from "../services/mockFarmService"

function FarmPage() {
  const { farmId } = useParams()

  const farm = farmId
    ? getFarmById(farmId)
    : undefined

  if (!farm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="p-10">
          Farm not found.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-6 py-10">
        <div className="mx-auto max-w-5xl">
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

            <div className="mt-10">
              <h2 className="text-xl font-bold text-gray-900">
                Soil Health
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current soil indicators used for regenerative recommendations.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-xl border border-gray-200 p-5">
                  <p className="text-sm text-gray-500">
                    pH
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {farm.soil.ph}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-5">
                  <p className="text-sm text-gray-500">
                    Nitrogen
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {farm.soil.nitrogen}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-5">
                  <p className="text-sm text-gray-500">
                    Phosphorus
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {farm.soil.phosphorus}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-5">
                  <p className="text-sm text-gray-500">
                    Potassium
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {farm.soil.potassium}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-5">
                  <p className="text-sm text-gray-500">
                    Moisture
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {farm.soil.moisture}
                  </p>
                </div>
              </div>
            </div>

            <Link
              to={`/farm/${farm.farm_id}/analysis`}
              className="mt-8 inline-block rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
            >
              Analyze Farm
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FarmPage
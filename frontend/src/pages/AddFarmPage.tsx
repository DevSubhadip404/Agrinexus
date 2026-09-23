import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Navbar from "../components/Navbar"
import { createFarm } from "../services/mockFarmService"

function AddFarmPage() {
  const navigate = useNavigate()

  const [crop, setCrop] = useState("rice")
  const [area, setArea] = useState("2.5")
  const [latitude, setLatitude] = useState("17.4")
  const [longitude, setLongitude] = useState("78.5")

  const [ph, setPh] = useState("6.5")
  const [nitrogen, setNitrogen] = useState("Medium")
  const [phosphorus, setPhosphorus] = useState("Medium")
  const [potassium, setPotassium] = useState("Medium")
  const [moisture, setMoisture] = useState("Medium")

  const [message, setMessage] = useState("")

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const newFarm = createFarm({
      crop,
      area_acres: Number(area),
      latitude: Number(latitude),
      longitude: Number(longitude),

      soil: {
        ph: Number(ph),
        nitrogen,
        phosphorus,
        potassium,
        moisture,
      },
    })

    setMessage("Farm created successfully.")

    setTimeout(() => {
      navigate(`/farm/${newFarm.farm_id}`)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <div className="px-6 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold tracking-widest text-green-700">
            AGRINEXUS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Add Farm
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Enter your farm and soil details.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Crop
              </label>

              <input
                value={crop}
                onChange={(event) => setCrop(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Area in acres
              </label>

              <input
                type="number"
                min="0.1"
                step="0.1"
                value={area}
                onChange={(event) => setArea(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Latitude
                </label>

                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(event) => setLatitude(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Longitude
                </label>

                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(event) => setLongitude(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
                  required
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-bold text-gray-900">
                Soil Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add basic soil health indicators for better recommendations.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Soil pH
              </label>

              <input
                type="number"
                min="0"
                max="14"
                step="0.1"
                value={ph}
                onChange={(event) => setPh(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nitrogen
                </label>

                <select
                  value={nitrogen}
                  onChange={(event) => setNitrogen(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phosphorus
                </label>

                <select
                  value={phosphorus}
                  onChange={(event) => setPhosphorus(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Potassium
                </label>

                <select
                  value={potassium}
                  onChange={(event) => setPotassium(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Soil Moisture
                </label>

                <select
                  value={moisture}
                  onChange={(event) => setMoisture(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
            >
              Create Farm
            </button>
          </form>

          {message && (
            <p className="mt-5 text-sm font-medium text-green-700">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddFarmPage
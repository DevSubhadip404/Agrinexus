import { useState } from "react"

function AddFarmPage() {
  const [crop, setCrop] = useState("rice")
  const [area, setArea] = useState("2.5")
  const [latitude, setLatitude] = useState("17.4")
  const [longitude, setLongitude] = useState("78.5")
  const [message, setMessage] = useState("")

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    setMessage("Creating farm...")

    try {
      const response = await fetch("http://10.124.251.50:8000/api/farms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crop,
          area_acres: Number(area),
          latitude: Number(latitude),
          longitude: Number(longitude),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error("Could not create farm")
      }

      setMessage(`Farm created: ${data.farm.farm_id}`)
    } catch (error) {
      console.error(error)
      setMessage("Failed to create farm")
    }
  }

  return (
    <div className="min-h-screen bg-green-50 px-6 py-10">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold tracking-widest text-green-700">
          AGRINEXUS
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Add Farm
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Crop
            </label>

            <input
              value={crop}
              onChange={(event) => setCrop(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Area in acres
            </label>

            <input
              type="number"
              value={area}
              onChange={(event) => setArea(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

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
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
          >
            Create Farm
          </button>
        </form>

        {message && (
          <p className="mt-5 text-sm font-medium text-gray-700">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default AddFarmPage
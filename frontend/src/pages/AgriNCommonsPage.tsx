import { useMemo, useState } from "react"

import Navbar from "../components/Navbar"

function AgriNCommonsPage() {
  const [search, setSearch] = useState("")
  const [country, setCountry] = useState("All")

  const nodes = [
    {
      country: "India",
      code: "IN",
      models: 12,
      datasets: 48,
      status: "Online",
    },
    {
      country: "Brazil",
      code: "BR",
      models: 9,
      datasets: 31,
      status: "Online",
    },
    {
      country: "South Africa",
      code: "ZA",
      models: 6,
      datasets: 18,
      status: "Online",
    },
  ]

  const models = [
    {
      id: "agrin-in-rice-stress-v1",
      name: "Rice Stress Detection Model",
      country: "India",
      crop: "Rice",
      category: "Crop Stress",
      version: "1.0",
      format: "AgriN Model Schema",
      license: "Open Research",
      endpoint: "/agrin/models/agrin-in-rice-stress-v1",
    },
    {
      id: "agrin-br-drought-v12",
      name: "Drought Risk Model",
      country: "Brazil",
      crop: "Soybean",
      category: "Climate Risk",
      version: "1.2",
      format: "AgriN Model Schema",
      license: "Open Research",
      endpoint: "/agrin/models/agrin-br-drought-v12",
    },
    {
      id: "agrin-za-soil-moisture-v1",
      name: "Soil Moisture Advisory Model",
      country: "South Africa",
      crop: "Maize",
      category: "Soil Intelligence",
      version: "1.0",
      format: "AgriN Model Schema",
      license: "Open Research",
      endpoint: "/agrin/models/agrin-za-soil-moisture-v1",
    },
    {
      id: "agrin-in-rice-disease-v11",
      name: "Rice Disease Screening Model",
      country: "India",
      crop: "Rice",
      category: "Disease Detection",
      version: "1.1",
      format: "AgriN Model Schema",
      license: "Open Research",
      endpoint: "/agrin/models/agrin-in-rice-disease-v11",
    },
  ]

  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      const matchesCountry =
        country === "All" || model.country === country

      const query = search.toLowerCase()

      const matchesSearch =
        model.name.toLowerCase().includes(query) ||
        model.crop.toLowerCase().includes(query) ||
        model.category.toLowerCase().includes(query)

      return matchesCountry && matchesSearch
    })
  }, [country, search])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold tracking-widest text-green-700">
            AGRIN OPEN
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            AgriN Commons
          </h1>

          <p className="mt-2 max-w-3xl text-gray-600">
            A shared agricultural intelligence network where participating
            regions can discover reusable datasets, models, and advisory tools.
          </p>

          <div className="mt-8 rounded-2xl bg-green-900 p-8 text-white">
            <p className="text-sm font-semibold tracking-widest text-green-200">
              INTEROPERABILITY LAYER
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              One network. Shared agricultural intelligence.
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-green-100">
              AgriNexus uses a common metadata structure so agricultural models
              and datasets from different countries can be discovered and
              reused through a consistent interface.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white/10 p-5">
                <p className="text-sm text-green-200">
                  Standard
                </p>

                <p className="mt-1 font-bold">
                  AgriN Model Schema
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-5">
                <p className="text-sm text-green-200">
                  Exchange
                </p>

                <p className="mt-1 font-bold">
                  REST + JSON
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-5">
                <p className="text-sm text-green-200">
                  Geospatial Ready
                </p>

                <p className="mt-1 font-bold">
                  STAC Compatible
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {nodes.map((node) => (
              <div
                key={node.code}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-gray-900">
                    {node.country}
                  </p>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {node.status}
                  </span>
                </div>

                <p className="mt-2 text-xs font-semibold text-gray-400">
                  NODE {node.code}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Models
                    </p>

                    <p className="text-2xl font-bold text-gray-900">
                      {node.models}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Datasets
                    </p>

                    <p className="text-2xl font-bold text-gray-900">
                      {node.datasets}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Shared Models
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Discover interoperable agricultural AI models.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search crop or model..."
                  className="rounded-xl border border-gray-300 px-4 py-3"
                />

                <select
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-3"
                >
                  <option value="All">
                    All countries
                  </option>

                  <option value="India">
                    India
                  </option>

                  <option value="Brazil">
                    Brazil
                  </option>

                  <option value="South Africa">
                    South Africa
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {filteredModels.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No matching models found.
                </p>
              ) : (
                filteredModels.map((model) => (
                  <div
                    key={model.id}
                    className="rounded-xl border border-gray-200 p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="font-bold text-gray-900">
                          {model.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {model.country} · {model.crop}
                        </p>

                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-green-700">
                          {model.category}
                        </p>
                      </div>

                      <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                        v{model.version}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">
                          Format
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {model.format}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">
                          License
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {model.license}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">
                          API Endpoint
                        </p>

                        <p className="mt-1 break-all text-sm font-semibold text-green-700">
                          {model.endpoint}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-green-300 bg-green-50 p-6">
            <p className="font-semibold text-green-900">
              AgriN Open Prototype
            </p>

            <p className="mt-2 text-sm leading-6 text-green-800">
              These nodes and endpoints are currently simulated for the MVP.
              The backend will expose the same standardized structure so
              participating regions can publish and consume agricultural
              intelligence through a common digital public infrastructure layer.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgriNCommonsPage
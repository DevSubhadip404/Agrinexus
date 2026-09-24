import { useEffect, useMemo, useState } from "react"
import {
  exchangeAgriNModel,
  getAgriNModels,
  getAgriNNodes,
  type AgriNModel,
  type AgriNNode,
  type ModelExchangeResponse,
} from "../services/agrinService"

export default function AgriNCommonsPage() {
  const [nodes, setNodes] = useState<AgriNNode[]>([])
  const [models, setModels] = useState<AgriNModel[]>([])
  const [search, setSearch] = useState("")
  const [countryFilter, setCountryFilter] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [selectedModelId, setSelectedModelId] = useState("")
  const [targetCountry, setTargetCountry] = useState("India")
  const [targetCrop, setTargetCrop] = useState("Rice")
  const [exchangeLoading, setExchangeLoading] = useState(false)
  const [exchangeError, setExchangeError] = useState("")
  const [exchangeResult, setExchangeResult] =
    useState<ModelExchangeResponse | null>(null)

  useEffect(() => {
    async function loadAgriNNetwork() {
      try {
        setLoading(true)
        setError("")

        const [nodeData, modelData] = await Promise.all([
          getAgriNNodes(),
          getAgriNModels(),
        ])

        setNodes(nodeData)
        setModels(modelData)

        if (modelData.length > 0) {
          setSelectedModelId(modelData[0].model_id)
        }
      } catch (err) {
        console.error(err)
        setError("Could not connect to the AgriN interoperability network.")
      } finally {
        setLoading(false)
      }
    }

    loadAgriNNetwork()
  }, [])

  const countries = useMemo(() => {
    return ["All", ...Array.from(new Set(models.map((model) => model.country)))]
  }, [models])

  const filteredModels = useMemo(() => {
    const query = search.toLowerCase().trim()

    return models.filter((model) => {
      const matchesCountry =
        countryFilter === "All" || model.country === countryFilter

      const matchesSearch =
        query.length === 0 ||
        model.name.toLowerCase().includes(query) ||
        model.model_id.toLowerCase().includes(query) ||
        model.crop.toLowerCase().includes(query) ||
        model.category.toLowerCase().includes(query) ||
        model.country.toLowerCase().includes(query)

      return matchesCountry && matchesSearch
    })
  }, [models, search, countryFilter])

  async function handleExchange() {
    if (!selectedModelId || !targetCountry || !targetCrop) {
      return
    }

    try {
      setExchangeLoading(true)
      setExchangeError("")
      setExchangeResult(null)

      const result = await exchangeAgriNModel({
        model_id: selectedModelId,
        target_country: targetCountry,
        target_crop: targetCrop,
      })

      setExchangeResult(result)
    } catch (err) {
      console.error(err)
      setExchangeError("Could not evaluate this model exchange.")
    } finally {
      setExchangeLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300">
            INTEROPERABILITY LAYER
          </div>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            AgriN Open
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            One network for shared agricultural intelligence across BRICS
            ecosystems. AgriNexus exposes agricultural models through a common,
            machine-readable interface so knowledge can move between regions
            instead of remaining trapped inside isolated platforms.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              AgriN Model Schema
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              REST + JSON
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              STAC-compatible metadata
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              Cross-country model exchange
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
            Connecting to AgriN Open...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-6 text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Federated network
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Connected agricultural nodes
              </h2>

              <p className="mt-3 max-w-3xl text-slate-400">
                Each node represents a participating agricultural ecosystem
                exposing models and datasets through the same interoperability
                layer.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {nodes.map((node) => (
                <div
                  key={node.node_id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">
                        {node.country_code} NODE
                      </p>

                      <h3 className="mt-1 text-xl font-semibold">
                        {node.country}
                      </h3>
                    </div>

                    <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                      {node.status}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-black/20 p-4">
                      <p className="text-2xl font-bold">{node.models}</p>
                      <p className="text-sm text-slate-400">Models</p>
                    </div>

                    <div className="rounded-xl bg-black/20 p-4">
                      <p className="text-2xl font-bold">{node.datasets}</p>
                      <p className="text-sm text-slate-400">Datasets</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {node.capabilities.map((capability) => (
                      <span
                        key={capability}
                        className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-400"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                    Shared model registry
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    Discover interoperable models
                  </h2>

                  <p className="mt-3 max-w-2xl text-slate-400">
                    Search models published by participating AgriN nodes using a
                    shared metadata schema.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search models..."
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/50"
                  />

                  <select
                    value={countryFilter}
                    onChange={(event) => setCountryFilter(event.target.value)}
                    className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {filteredModels.map((model) => (
                  <article
                    key={model.model_id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-xs text-emerald-400">
                          {model.model_id}
                        </p>

                        <h3 className="mt-2 text-xl font-semibold">
                          {model.name}
                        </h3>
                      </div>

                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                        v{model.version}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Provider
                        </p>
                        <p className="mt-1 text-sm">{model.country}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Crop
                        </p>
                        <p className="mt-1 text-sm">{model.crop}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Category
                        </p>
                        <p className="mt-1 text-sm">{model.category}</p>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-white/10 pt-5">
                      <div className="flex flex-wrap gap-2">
                        {model.input_types.map((inputType) => (
                          <span
                            key={inputType}
                            className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300"
                          >
                            {inputType}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                        <p>
                          Output:{" "}
                          <span className="text-slate-200">
                            {model.output_type}
                          </span>
                        </p>

                        <p>
                          License:{" "}
                          <span className="text-slate-200">
                            {model.license}
                          </span>
                        </p>

                        <p>
                          Schema:{" "}
                          <span className="text-slate-200">
                            {model.schema}
                          </span>
                        </p>

                        <p>
                          Geospatial:{" "}
                          <span className="text-slate-200">
                            {model.stac_compatible
                              ? "STAC Compatible"
                              : "Not Required"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-16 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.06] p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Cross-country exchange
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Test model portability
              </h2>

              <p className="mt-3 max-w-3xl text-slate-300">
                Select a model from one AgriN node and evaluate whether its
                declared crop and metadata are suitable for another agricultural
                context.
              </p>

              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Shared model
                  </label>

                  <select
                    value={selectedModelId}
                    onChange={(event) =>
                      setSelectedModelId(event.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                  >
                    {models.map((model) => (
                      <option key={model.model_id} value={model.model_id}>
                        {model.name} — {model.country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Target country
                  </label>

                  <select
                    value={targetCountry}
                    onChange={(event) =>
                      setTargetCountry(event.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="India">India</option>
                    <option value="Brazil">Brazil</option>
                    <option value="South Africa">South Africa</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Target crop
                  </label>

                  <select
                    value={targetCrop}
                    onChange={(event) =>
                      setTargetCrop(event.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="Rice">Rice</option>
                    <option value="Soybean">Soybean</option>
                    <option value="Maize">Maize</option>
                    <option value="Tomato">Tomato</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleExchange}
                disabled={exchangeLoading}
                className="mt-6 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {exchangeLoading
                  ? "Evaluating exchange..."
                  : "Evaluate Model Exchange"}
              </button>

              {exchangeError && (
                <div className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
                  {exchangeError}
                </div>
              )}

              {exchangeResult && (
                <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/60 p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        INTEROPERABILITY ASSESSMENT
                      </p>

                      <h3 className="mt-2 text-2xl font-bold">
                        {exchangeResult.model.name}
                      </h3>

                      <p className="mt-2 text-sm text-slate-400">
                        {exchangeResult.source_node.country} →{" "}
                        {exchangeResult.target_context.country}
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-center">
                      <p className="text-3xl font-bold text-emerald-300">
                        {exchangeResult.compatibility.score}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-emerald-400">
                        Compatibility
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Status
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      {exchangeResult.compatibility.status}
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-semibold text-slate-200">
                      Adaptation notes
                    </p>

                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">
                      {exchangeResult.adaptation_notes.map((note) => (
                        <li key={note}>• {note}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-slate-500">Crop match</p>
                      <p className="mt-1">
                        {exchangeResult.compatibility.crop_match
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-slate-500">Provider</p>
                      <p className="mt-1">
                        {exchangeResult.provenance.provider}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-slate-500">Schema</p>
                      <p className="mt-1">
                        {exchangeResult.provenance.schema}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-slate-500">Geospatial</p>
                      <p className="mt-1">
                        {exchangeResult.provenance.stac_compatible
                          ? "STAC Compatible"
                          : "Not Required"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-slate-500">
                    {exchangeResult.disclaimer}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.04] p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Digital Public Good Prototype
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Built for agricultural intelligence exchange
              </h2>

              <p className="mt-4 max-w-4xl leading-7 text-slate-300">
                AgriNexus currently simulates participating BRICS agricultural
                nodes while exposing them through a real FastAPI
                interoperability layer. The architecture is designed so future
                institutions can publish compatible datasets and models without
                rebuilding the farmer-facing application.
              </p>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
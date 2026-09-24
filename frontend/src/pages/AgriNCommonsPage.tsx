import {
  useEffect,
  useMemo,
  useState,
} from "react"

import Navbar from "../components/Navbar"

import {
  exchangeAgriNModel,
  getAgriNModels,
  getAgriNNodes,
  type AgriNModel,
  type AgriNNode,
  type ModelExchangeResponse,
} from "../services/agrinService"


const suggestedTargetCrops = [
  "Rice",
  "Wheat",
  "Maize",
  "Soybean",
  "Tomato",
  "Cotton",
  "Potato",
  "Sugarcane",
]


export default function AgriNCommonsPage() {
  const [nodes, setNodes] =
    useState<AgriNNode[]>([])

  const [models, setModels] =
    useState<AgriNModel[]>([])

  const [search, setSearch] =
    useState("")

  const [countryFilter, setCountryFilter] =
    useState("All")

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")


  const [selectedModelId, setSelectedModelId] =
    useState("")

  const [targetCountry, setTargetCountry] =
    useState("India")

  const [targetCrop, setTargetCrop] =
    useState("Rice")

  const [exchangeLoading, setExchangeLoading] =
    useState(false)

  const [exchangeError, setExchangeError] =
    useState("")

  const [exchangeResult, setExchangeResult] =
    useState<ModelExchangeResponse | null>(
      null
    )


  useEffect(() => {
    async function loadAgriNNetwork() {
      try {
        setLoading(true)
        setError("")

        const [nodeData, modelData] =
          await Promise.all([
            getAgriNNodes(),
            getAgriNModels(),
          ])

        setNodes(nodeData)
        setModels(modelData)

        if (modelData.length > 0) {
          setSelectedModelId(
            modelData[0].model_id
          )
        }

        if (nodeData.length > 0) {
          setTargetCountry(
            nodeData[0].country
          )
        }
      } catch (err) {
        console.error(err)

        setError(
          "Could not connect to the AgriN interoperability API."
        )
      } finally {
        setLoading(false)
      }
    }

    loadAgriNNetwork()
  }, [])


  const countries =
    useMemo(() => {
      return [
        "All",
        ...Array.from(
          new Set(
            models.map(
              (model) =>
                model.country
            )
          )
        ),
      ]
    }, [models])


  const targetCountries =
    useMemo(() => {
      return Array.from(
        new Set(
          nodes.map(
            (node) =>
              node.country
          )
        )
      )
    }, [nodes])


  const filteredModels =
    useMemo(() => {
      const query =
        search
          .toLowerCase()
          .trim()

      return models.filter(
        (model) => {
          const matchesCountry =
            countryFilter === "All" ||
            model.country ===
              countryFilter

          const matchesSearch =
            query.length === 0 ||
            model.name
              .toLowerCase()
              .includes(query) ||
            model.model_id
              .toLowerCase()
              .includes(query) ||
            model.crop
              .toLowerCase()
              .includes(query) ||
            model.category
              .toLowerCase()
              .includes(query) ||
            model.country
              .toLowerCase()
              .includes(query)

          return (
            matchesCountry &&
            matchesSearch
          )
        }
      )
    }, [
      models,
      search,
      countryFilter,
    ])


  const selectedModel =
    useMemo(() => {
      return (
        models.find(
          (model) =>
            model.model_id ===
            selectedModelId
        ) ?? null
      )
    }, [
      models,
      selectedModelId,
    ])


  async function handleExchange() {
    if (
      !selectedModelId ||
      !targetCountry ||
      !targetCrop.trim()
    ) {
      return
    }

    try {
      setExchangeLoading(true)
      setExchangeError("")
      setExchangeResult(null)

      const result =
        await exchangeAgriNModel({
          model_id:
            selectedModelId,

          target_country:
            targetCountry,

          target_crop:
            targetCrop.trim(),
        })

      setExchangeResult(result)
    } catch (err) {
      console.error(err)

      setExchangeError(
        "Could not evaluate this model exchange."
      )
    } finally {
      setExchangeLoading(false)
    }
  }


  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />


      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-950">

        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-400/5 blur-3xl" />

        <div className="absolute -bottom-56 left-1/4 h-96 w-96 rounded-full bg-cyan-400/5 blur-3xl" />


        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3">

                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold tracking-[0.18em] text-emerald-300">
                  AGRIN INTEROPERABILITY
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                  Digital Public Good Prototype
                </span>
              </div>


              <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
                AgriN Commons
              </h1>


              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                A prototype interoperability layer for moving agricultural
                model metadata and intelligence between regional ecosystems
                through a common machine-readable interface.
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
                  Cross-country exchange
                </span>
              </div>
            </div>


            <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[340px]">

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08] p-5">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                    Real Layer
                  </p>
                </div>

                <p className="mt-3 font-semibold">
                  FastAPI interoperability API
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Registry and exchange endpoints are implemented and used by
                  this interface.
                </p>
              </div>


              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.07] p-5">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />

                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
                    Prototype Layer
                  </p>
                </div>

                <p className="mt-3 font-semibold">
                  BRICS federation
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Participating country nodes and model catalog entries are
                  simulated for the interoperability demonstration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="mx-auto max-w-7xl px-6 py-12">

        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <div className="flex items-center gap-3">

              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />

              <p className="text-sm text-slate-300">
                Loading AgriN registry...
              </p>
            </div>
          </div>
        )}


        {error && (
          <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-6 text-red-200">
            {error}
          </div>
        )}


        {!loading &&
          !error && (
            <>
              <section>

                <div className="grid gap-4 sm:grid-cols-3">

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Prototype Nodes
                    </p>

                    <p className="mt-2 text-3xl font-bold text-emerald-300">
                      {nodes.length}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Simulated federation participants
                    </p>
                  </div>


                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Registry Models
                    </p>

                    <p className="mt-2 text-3xl font-bold text-cyan-300">
                      {models.length}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Model metadata records
                    </p>
                  </div>


                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Countries Represented
                    </p>

                    <p className="mt-2 text-3xl font-bold text-purple-300">
                      {
                        new Set(
                          nodes.map(
                            (node) =>
                              node.country
                          )
                        ).size
                      }
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Prototype country contexts
                    </p>
                  </div>
                </div>
              </section>


              <section className="mt-16">

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">
                    PROTOTYPE FEDERATION
                  </p>

                  <h2 className="mt-3 text-3xl font-bold">
                    Agricultural nodes
                  </h2>

                  <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                    These simulated nodes demonstrate how participating
                    agricultural ecosystems could expose models and datasets
                    through a shared interoperability contract.
                  </p>
                </div>


                <div className="mt-8 grid gap-5 md:grid-cols-3">

                  {nodes.map(
                    (node) => (
                      <article
                        key={
                          node.node_id
                        }
                        className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 transition hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.07]"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>
                            <p className="font-mono text-xs font-semibold text-emerald-400">
                              {
                                node.country_code
                              }{" "}
                              NODE
                            </p>

                            <h3 className="mt-2 text-2xl font-bold">
                              {
                                node.country
                              }
                            </h3>
                          </div>


                          <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                            Prototype Node
                          </span>
                        </div>


                        <div className="mt-6 grid grid-cols-2 gap-3">

                          <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                            <p className="text-2xl font-bold">
                              {
                                node.models
                              }
                            </p>

                            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                              Declared Models
                            </p>
                          </div>


                          <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                            <p className="text-2xl font-bold">
                              {
                                node.datasets
                              }
                            </p>

                            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                              Declared Datasets
                            </p>
                          </div>
                        </div>


                        <div className="mt-5">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Demonstrated capabilities
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">

                            {node.capabilities.map(
                              (
                                capability
                              ) => (
                                <span
                                  key={
                                    capability
                                  }
                                  className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-300"
                                >
                                  {
                                    capability
                                  }
                                </span>
                              )
                            )}
                          </div>
                        </div>


                        <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-slate-500">
                          Backend status:{" "}
                          <span className="text-slate-300">
                            {
                              node.status
                            }
                          </span>
                          . This represents the prototype registry entry, not a
                          live national institution.
                        </p>
                      </article>
                    )
                  )}
                </div>
              </section>


              <section className="mt-16">

                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">
                      SHARED MODEL REGISTRY
                    </p>

                    <h2 className="mt-3 text-3xl font-bold">
                      Discover interoperable models
                    </h2>

                    <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                      Search prototype model records exposed using a shared
                      metadata structure across participating node contexts.
                    </p>
                  </div>


                  <div className="flex flex-col gap-3 sm:flex-row">

                    <div className="relative">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                      >
                        <circle
                          cx="11"
                          cy="11"
                          r="7"
                        />

                        <path d="M20 20l-4-4" />
                      </svg>

                      <input
                        value={
                          search
                        }
                        onChange={(
                          event
                        ) =>
                          setSearch(
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Search models..."
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/50 sm:w-64"
                      />
                    </div>


                    <select
                      value={
                        countryFilter
                      }
                      onChange={(
                        event
                      ) =>
                        setCountryFilter(
                          event
                            .target
                            .value
                        )
                      }
                      className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
                    >
                      {countries.map(
                        (
                          country
                        ) => (
                          <option
                            key={
                              country
                            }
                            value={
                              country
                            }
                          >
                            {
                              country
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>


                <div className="mt-8 grid gap-5 lg:grid-cols-2">

                  {filteredModels.map(
                    (model) => (
                      <article
                        key={
                          model.model_id
                        }
                        className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-emerald-400/20 hover:bg-white/[0.055]"
                      >

                        <div className="flex flex-wrap items-start justify-between gap-4">

                          <div>
                            <p className="font-mono text-xs text-emerald-400">
                              {
                                model.model_id
                              }
                            </p>

                            <h3 className="mt-2 text-xl font-bold">
                              {
                                model.name
                              }
                            </h3>
                          </div>


                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                            v
                            {
                              model.version
                            }
                          </span>
                        </div>


                        <div className="mt-5 flex flex-wrap gap-2">

                          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                            {
                              model.country
                            }
                          </span>

                          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                            {
                              model.crop
                            }
                          </span>

                          <span className="rounded-full bg-purple-400/10 px-3 py-1 text-xs font-semibold text-purple-300">
                            {
                              model.category
                            }
                          </span>
                        </div>


                        <div className="mt-6">

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Expected inputs
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">

                            {model.input_types.map(
                              (
                                inputType
                              ) => (
                                <span
                                  key={
                                    inputType
                                  }
                                  className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-300"
                                >
                                  {
                                    inputType
                                  }
                                </span>
                              )
                            )}
                          </div>
                        </div>


                        <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 text-sm sm:grid-cols-2">

                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              Output
                            </p>

                            <p className="mt-1 text-slate-200">
                              {
                                model.output_type
                              }
                            </p>
                          </div>


                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              License
                            </p>

                            <p className="mt-1 text-slate-200">
                              {
                                model.license
                              }
                            </p>
                          </div>


                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              Schema
                            </p>

                            <p className="mt-1 text-slate-200">
                              {
                                model.schema
                              }
                            </p>
                          </div>


                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              Geospatial Metadata
                            </p>

                            <p className="mt-1 text-slate-200">
                              {model.stac_compatible
                                ? "STAC Compatible"
                                : "Not Required"}
                            </p>
                          </div>
                        </div>
                      </article>
                    )
                  )}
                </div>


                {filteredModels.length ===
                  0 && (
                  <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
                    No registry models match this search.
                  </div>
                )}
              </section>


              <section className="mt-16 overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/[0.08] via-emerald-400/[0.04] to-cyan-400/[0.03]">

                <div className="p-8 md:p-10">

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                    <div className="max-w-3xl">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">
                        CROSS-COUNTRY EXCHANGE
                      </p>

                      <h2 className="mt-3 text-3xl font-bold">
                        Test model portability
                      </h2>

                      <p className="mt-3 leading-7 text-slate-300">
                        Select a registry model and evaluate how its declared
                        source context compares with another country and crop.
                        The returned score is a prototype rule-based
                        compatibility assessment, not validated agronomic
                        performance.
                      </p>
                    </div>


                    <span className="w-fit rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-200">
                      Prototype assessment
                    </span>
                  </div>


                  <div className="mt-9 grid gap-5 lg:grid-cols-3">

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-400">
                        Shared model
                      </label>

                      <select
                        value={
                          selectedModelId
                        }
                        onChange={(
                          event
                        ) => {
                          setSelectedModelId(
                            event
                              .target
                              .value
                          )

                          setExchangeResult(
                            null
                          )
                        }}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
                      >
                        {models.map(
                          (
                            model
                          ) => (
                            <option
                              key={
                                model.model_id
                              }
                              value={
                                model.model_id
                              }
                            >
                              {
                                model.name
                              }{" "}
                              —{" "}
                              {
                                model.country
                              }
                            </option>
                          )
                        )}
                      </select>
                    </div>


                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-400">
                        Target country
                      </label>

                      <select
                        value={
                          targetCountry
                        }
                        onChange={(
                          event
                        ) => {
                          setTargetCountry(
                            event
                              .target
                              .value
                          )

                          setExchangeResult(
                            null
                          )
                        }}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
                      >
                        {targetCountries.map(
                          (
                            country
                          ) => (
                            <option
                              key={
                                country
                              }
                              value={
                                country
                              }
                            >
                              {
                                country
                              }
                            </option>
                          )
                        )}
                      </select>
                    </div>


                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-400">
                        Target crop
                      </label>

                      <input
                        type="text"
                        list="agrin-target-crops"
                        value={
                          targetCrop
                        }
                        onChange={(
                          event
                        ) => {
                          setTargetCrop(
                            event
                              .target
                              .value
                          )

                          setExchangeResult(
                            null
                          )
                        }}
                        placeholder="e.g. Rice"
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
                      />

                      <datalist id="agrin-target-crops">
                        {suggestedTargetCrops.map(
                          (
                            crop
                          ) => (
                            <option
                              key={
                                crop
                              }
                              value={
                                crop
                              }
                            />
                          )
                        )}
                      </datalist>
                    </div>
                  </div>


                  {selectedModel && (
                    <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-400">

                      <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                        Source:{" "}
                        {
                          selectedModel.country
                        }
                      </span>

                      <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                        Model crop:{" "}
                        {
                          selectedModel.crop
                        }
                      </span>

                      <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                        Category:{" "}
                        {
                          selectedModel.category
                        }
                      </span>
                    </div>
                  )}


                  <button
                    type="button"
                    onClick={
                      handleExchange
                    }
                    disabled={
                      exchangeLoading ||
                      !selectedModelId ||
                      !targetCountry ||
                      !targetCrop.trim()
                    }
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {exchangeLoading ? (
                      <>
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-800" />

                        Evaluating exchange...
                      </>
                    ) : (
                      <>
                        Evaluate Model Exchange
                        <span>→</span>
                      </>
                    )}
                  </button>


                  {exchangeError && (
                    <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
                      {
                        exchangeError
                      }
                    </div>
                  )}


                  {exchangeResult && (
                    <div className="mt-9 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70">

                      <div className="border-b border-white/10 p-6 md:p-7">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                              PROTOTYPE COMPATIBILITY ASSESSMENT
                            </p>

                            <h3 className="mt-3 text-2xl font-bold">
                              {
                                exchangeResult
                                  .model
                                  .name
                              }
                            </h3>

                            <p className="mt-2 text-sm text-slate-400">
                              {
                                exchangeResult
                                  .source_node
                                  .country
                              }{" "}
                              →{" "}
                              {
                                exchangeResult
                                  .target_context
                                  .country
                              }
                            </p>
                          </div>


                          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-6 py-4 text-center">

                            <p className="text-3xl font-bold text-emerald-300">
                              {
                                exchangeResult
                                  .compatibility
                                  .score
                              }
                            </p>

                            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                              Rule-based score
                            </p>
                          </div>
                        </div>
                      </div>


                      <div className="p-6 md:p-7">

                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Assessment status
                          </p>

                          <p className="mt-2 text-lg font-bold text-white">
                            {
                              exchangeResult
                                .compatibility
                                .status
                            }
                          </p>

                          <p className="mt-2 text-xs leading-5 text-slate-500">
                            This status is generated by prototype compatibility
                            rules and should not be interpreted as agronomic
                            validation.
                          </p>
                        </div>


                        <div className="mt-6">

                          <p className="text-sm font-bold text-slate-200">
                            Adaptation notes
                          </p>

                          <div className="mt-3 space-y-3">

                            {exchangeResult.adaptation_notes.map(
                              (
                                note,
                                index
                              ) => (
                                <div
                                  key={`${note}-${index}`}
                                  className="flex gap-3 rounded-xl bg-white/[0.04] p-4"
                                >
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-bold text-emerald-300">
                                    {
                                      index +
                                      1
                                    }
                                  </span>

                                  <p className="text-sm leading-6 text-slate-300">
                                    {
                                      note
                                    }
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>


                        <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">

                          <div className="rounded-xl bg-white/[0.04] p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              Crop match
                            </p>

                            <p className="mt-2 font-semibold">
                              {exchangeResult
                                .compatibility
                                .crop_match
                                ? "Yes"
                                : "No"}
                            </p>
                          </div>


                          <div className="rounded-xl bg-white/[0.04] p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              Provider
                            </p>

                            <p className="mt-2 font-semibold">
                              {
                                exchangeResult
                                  .provenance
                                  .provider
                              }
                            </p>
                          </div>


                          <div className="rounded-xl bg-white/[0.04] p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              Schema
                            </p>

                            <p className="mt-2 font-semibold">
                              {
                                exchangeResult
                                  .provenance
                                  .schema
                              }
                            </p>
                          </div>


                          <div className="rounded-xl bg-white/[0.04] p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              Geospatial
                            </p>

                            <p className="mt-2 font-semibold">
                              {exchangeResult
                                .provenance
                                .stac_compatible
                                ? "STAC Compatible"
                                : "Not Required"}
                            </p>
                          </div>
                        </div>


                        <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5">

                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
                            Prototype notice
                          </p>

                          <p className="mt-2 text-xs leading-6 text-slate-400">
                            {
                              exchangeResult.disclaimer
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>


              <section className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-8 md:p-10">

                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                  <div className="max-w-4xl">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">
                      DIGITAL PUBLIC GOOD PROTOTYPE
                    </p>

                    <h2 className="mt-3 text-2xl font-bold">
                      Built for agricultural intelligence exchange
                    </h2>

                    <p className="mt-4 leading-7 text-slate-300">
                      AgriNexus currently simulates participating BRICS
                      agricultural nodes while exposing them through a real
                      FastAPI interoperability layer. The architecture is
                      designed so future institutions can publish compatible
                      model metadata and datasets without rebuilding the
                      farmer-facing application.
                    </p>
                  </div>


                  <div className="grid shrink-0 gap-2 text-xs sm:grid-cols-2 lg:grid-cols-1">

                    <span className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-emerald-200">
                      ✓ Real API endpoints
                    </span>

                    <span className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-emerald-200">
                      ✓ Shared schema
                    </span>

                    <span className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-amber-200">
                      Prototype federation
                    </span>
                  </div>
                </div>
              </section>
            </>
          )}
      </section>
    </main>
  )
}
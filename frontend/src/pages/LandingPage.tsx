import { Link } from "react-router-dom"

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="border-b border-green-100 bg-white/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex flex-col">
            <div className="brand-wordmark text-[26px]">
              <span className="text-green-700">
                Agri
              </span>

              <span className="text-gray-900">
                Nexus
              </span>
            </div>

            <span className="brand-subtitle mt-1 text-[9px] text-gray-400">
              BY ASTRAEL
            </span>
          </div>

          <Link
            to="/dashboard"
            className="rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            Open Dashboard
          </Link>
        </div>
      </header>


      <main>
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-4xl">
              <p className="text-sm font-bold tracking-[0.25em] text-green-700">
                AGRIN • REGENERATIVE AGRICULTURAL INTELLIGENCE
              </p>

              <h1 className="mt-6 text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
                Intelligent agriculture.
                <span className="block text-green-700">
                  Connected communities.
                </span>
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
                AgriNexus combines satellite signals, weather intelligence,
                soil health, crop diagnostics, and regenerative farming
                recommendations into one interoperable agricultural network.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/dashboard"
                  className="rounded-xl bg-green-700 px-7 py-3.5 text-center font-semibold text-white transition hover:bg-green-800"
                >
                  Explore AgriNexus
                </Link>

                <Link
                  to="/agrin-commons"
                  className="rounded-xl border border-green-700 px-7 py-3.5 text-center font-semibold text-green-700 transition hover:bg-green-50"
                >
                  Explore AgriN Commons
                </Link>
              </div>


              <div className="mt-8 flex flex-wrap items-center gap-2">
                <div className="mr-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Real data pipeline
                </div>

                {[
                  "Sentinel-2",
                  "Open-Meteo",
                  "Gemini",
                  "Firestore",
                ].map((source) => (
                  <span
                    key={source}
                    className="rounded-full border border-green-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>


        <section className="px-6 pb-16">
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                >
                  <path d="M7 17l-3 3" />
                  <path d="M17 7l3-3" />
                  <path d="M8 8l8 8" />
                  <rect
                    x="7"
                    y="7"
                    width="10"
                    height="10"
                    rx="2"
                  />
                  <path d="M4 7l3 1" />
                  <path d="M17 16l3 1" />
                </svg>
              </div>

              <h2 className="mt-5 text-lg font-bold text-gray-900">
                Satellite Intelligence
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Sentinel-2 NDVI and NDMI observations help surface vegetation
                and moisture signals.
              </p>
            </div>


            <div className="rounded-2xl bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                >
                  <path d="M7 16a4 4 0 1 1 1-7.87A5 5 0 0 1 17.9 10H18a3 3 0 0 1 0 6H7z" />
                  <path d="M8 19l-1 2" />
                  <path d="M13 19l-1 2" />
                  <path d="M18 19l-1 2" />
                </svg>
              </div>

              <h2 className="mt-5 text-lg font-bold text-gray-900">
                Weather Awareness
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Live rainfall, humidity, and temperature signals support
                irrigation and crop-risk decisions.
              </p>
            </div>


            <div className="rounded-2xl bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                >
                  <path d="M12 21V10" />
                  <path d="M12 13c-4 0-7-2-7-6 4 0 7 2 7 6z" />
                  <path d="M12 10c0-4 3-6 7-6 0 4-3 6-7 6z" />
                </svg>
              </div>

              <h2 className="mt-5 text-lg font-bold text-gray-900">
                Regenerative Advice
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Soil and field signals are translated into practical
                recommendations for healthier, more resilient farms.
              </p>
            </div>


            <div className="rounded-2xl bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  />
                  <path d="M3 12h18" />
                  <path d="M12 3a15 15 0 0 1 0 18" />
                  <path d="M12 3a15 15 0 0 0 0 18" />
                </svg>
              </div>

              <h2 className="mt-5 text-lg font-bold text-gray-900">
                AgriN Open
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                An interoperability prototype for sharing agricultural models,
                metadata, and intelligence across participating nodes.
              </p>
            </div>
          </div>
        </section>


        <section className="bg-green-950 px-6 py-16 text-white">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold tracking-widest text-green-300">
              HOW IT WORKS
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              From field signals to farmer action
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-4">
              <div>
                <p className="text-4xl font-bold text-green-400">
                  01
                </p>

                <h3 className="mt-4 font-bold">
                  Register Farm
                </h3>

                <p className="mt-2 text-sm leading-6 text-green-100">
                  Add farm location, crop, and basic soil indicators.
                </p>
              </div>

              <div>
                <p className="text-4xl font-bold text-green-400">
                  02
                </p>

                <h3 className="mt-4 font-bold">
                  Combine Signals
                </h3>

                <p className="mt-2 text-sm leading-6 text-green-100">
                  Fuse Sentinel-2, soil, and live weather information.
                </p>
              </div>

              <div>
                <p className="text-4xl font-bold text-green-400">
                  03
                </p>

                <h3 className="mt-4 font-bold">
                  Generate Advisory
                </h3>

                <p className="mt-2 text-sm leading-6 text-green-100">
                  Produce multilingual regenerative recommendations.
                </p>
              </div>

              <div>
                <p className="text-4xl font-bold text-green-400">
                  04
                </p>

                <h3 className="mt-4 font-bold">
                  Share Intelligence
                </h3>

                <p className="mt-2 text-sm leading-6 text-green-100">
                  Exchange interoperable agricultural models through AgriN
                  Commons.
                </p>
              </div>
            </div>
          </div>
        </section>


        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl rounded-3xl bg-green-50 p-10 text-center">
            <p className="text-sm font-semibold tracking-widest text-green-700">
              BUILT FOR COOPERATION
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Local intelligence. Shared globally.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
              AgriNexus is designed as a digital public infrastructure layer
              that can help agricultural communities share useful models,
              datasets, and knowledge while keeping advisories locally relevant.
            </p>

            <Link
              to="/agrin-commons"
              className="mt-7 inline-block rounded-xl bg-green-700 px-7 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              Explore AgriN Commons
            </Link>
          </div>
        </section>
      </main>


      <footer className="border-t border-gray-200 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            AgriNexus by Astrael
          </p>

          <p>
            Code for Communities 2.0
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
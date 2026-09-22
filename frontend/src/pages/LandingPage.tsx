import { Link } from "react-router-dom"

function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center px-6">
        <p className="text-sm font-semibold tracking-[0.3em] text-green-700">
          ASTRAEL
        </p>

        <h1 className="mt-3 text-5xl font-bold text-gray-900">
          AgriNexus
        </h1>

        <p className="mt-4 text-gray-600">
          Intelligent agriculture. Connected communities.
        </p>

        <Link
          to="/dashboard"
          className="inline-block mt-8 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
        >
          Enter Dashboard
        </Link>
      </div>
    </div>
  )
}

export default LandingPage
import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          to="/dashboard"
          className="text-xl font-bold text-green-700"
        >
          AgriNexus
        </Link>

        <div className="flex gap-5 text-sm font-semibold text-gray-700">
          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/crop-doctor">
            Crop Doctor
          </Link>

          <Link to="/agrin-commons">
            AgriN Commons
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
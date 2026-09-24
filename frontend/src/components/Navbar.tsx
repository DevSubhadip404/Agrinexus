import { useState } from "react"
import { Link, NavLink } from "react-router-dom"


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinkClass = ({
    isActive,
  }: {
    isActive: boolean
  }) =>
    `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-green-50 text-green-700"
        : "text-gray-700 hover:bg-gray-50 hover:text-green-700"
    }`


  return (
    <>
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="group flex flex-col"
          >
            <div className="brand-wordmark text-[22px]">
              <span className="text-green-700">
                Agri
              </span>

              <span className="text-gray-900 transition group-hover:text-green-800">
                Nexus
              </span>
            </div>

            <span className="brand-subtitle mt-1 text-[9px] text-gray-400">
              BY ASTRAEL
            </span>
          </Link>


          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
            aria-label="Open navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>


      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <div className="brand-wordmark text-xl">
                  <span className="text-green-700">
                    Agri
                  </span>

                  <span className="text-gray-900">
                    Nexus
                  </span>
                </div>

                <p className="brand-subtitle mt-1 text-[9px] text-gray-400">
                  BY ASTRAEL
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                aria-label="Close navigation menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="h-5 w-5"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </svg>
              </button>
            </div>


            <div className="flex-1 px-4 py-6">
              <nav className="space-y-2">
                <NavLink
                  to="/dashboard"
                  end
                  onClick={() => setMenuOpen(false)}
                  className={navLinkClass}
                >
                  <div>
                    <p>Dashboard</p>

                    <p className="mt-1 text-xs font-normal text-gray-500">
                      Farms, alerts, and agricultural intelligence
                    </p>
                  </div>
                </NavLink>

                <NavLink
                  to="/crop-doctor"
                  end
                  onClick={() => setMenuOpen(false)}
                  className={navLinkClass}
                >
                  <div>
                    <p>Crop Doctor</p>

                    <p className="mt-1 text-xs font-normal text-gray-500">
                      AI-assisted crop image diagnosis
                    </p>
                  </div>
                </NavLink>

                <NavLink
                  to="/agrin-commons"
                  end
                  onClick={() => setMenuOpen(false)}
                  className={navLinkClass}
                >
                  <div>
                    <p>AgriN Commons</p>

                    <p className="mt-1 text-xs font-normal text-gray-500">
                      Models, nodes, and cross-country exchange
                    </p>
                  </div>
                </NavLink>
              </nav>
            </div>


            <div className="border-t border-gray-200 p-6">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-green-700 transition hover:text-green-800"
              >
                ← Back to AgriNexus home
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}


export default Navbar
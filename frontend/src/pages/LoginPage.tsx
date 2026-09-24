import {
  useEffect,
  useState,
} from "react"

import {
  useLocation,
  useNavigate,
} from "react-router-dom"

import { useAuth } from "../context/AuthContext"
import { signInWithGoogle } from "../services/authService"


function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.22c0-.74-.07-1.45-.19-2.14H12v4.05h5.24a4.49 4.49 0 0 1-1.94 2.94v2.62h3.14c1.84-1.69 2.91-4.18 2.91-7.47Z"
      />
      <path
        fill="#34A853"
        d="M12 21.75c2.62 0 4.82-.87 6.43-2.36l-3.14-2.62c-.87.58-1.99.93-3.29.93-2.53 0-4.68-1.71-5.45-4.01H3.31v2.7A9.72 9.72 0 0 0 12 21.75Z"
      />
      <path
        fill="#FBBC05"
        d="M6.55 13.69A5.84 5.84 0 0 1 6.24 12c0-.59.1-1.16.3-1.69V7.61H3.31A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.06 4.39l3.24-2.7Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.3c1.42 0 2.7.49 3.71 1.45l2.79-2.79A9.36 9.36 0 0 0 12 2.25a9.72 9.72 0 0 0-8.69 5.36l3.23 2.7C7.32 8.01 9.47 6.3 12 6.3Z"
      />
    </svg>
  )
}


type LoginLocationState = {
  from?: string
}


export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    user,
    loading,
    startGuestSession,
  } = useAuth()

  const [signingIn, setSigningIn] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)


  const state =
    location.state as LoginLocationState | null

  const destination =
    state?.from || "/dashboard"


  useEffect(() => {
    if (!loading && user) {
      navigate(
        destination,
        { replace: true }
      )
    }
  }, [
    user,
    loading,
    navigate,
    destination,
  ])


  async function handleGoogleSignIn() {
    setError(null)
    setSigningIn(true)

    try {
      await signInWithGoogle()

      navigate(
        destination,
        { replace: true }
      )
    } catch (signInError) {
      console.error(
        "Google sign-in failed:",
        signInError
      )

      setError(
        "Google sign-in could not be completed. Please try again."
      )
    } finally {
      setSigningIn(false)
    }
  }


  async function handleGuestAccess() {
    setError(null)

    try {
      await startGuestSession()

      navigate(
        destination,
        { replace: true }
      )
    } catch (guestError) {
      console.error(
        "Guest session failed:",
        guestError
      )

      setError(
        "Guest access could not be started. Please try again."
      )
    }
  }


  return (
    <main className="min-h-screen bg-[#021d12]">
      <div className="relative min-h-screen overflow-hidden bg-[#032818] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />


        <svg
          viewBox="0 0 760 760"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-[-140px] h-[720px] w-[720px] opacity-[0.075]"
        >
          <path
            d="M70 505C164 407 237 428 321 333C402 242 505 249 673 132"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green-200"
          />

          <path
            d="M39 570C145 465 230 485 334 389C432 299 543 292 714 176"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green-200"
          />

          <path
            d="M98 629C196 539 296 540 387 459C484 373 578 368 735 268"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green-200"
          />

          <path
            d="M177 215 318 165 434 236 386 360 223 374 149 302Z"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green-300"
          />

          <path
            d="M318 165 341 282 223 374"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green-300"
          />

          <path
            d="M341 282 434 236"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green-300"
          />

          <circle
            cx="341"
            cy="282"
            r="118"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="8 12"
            className="text-emerald-200"
          />

          <circle
            cx="341"
            cy="282"
            r="176"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 15"
            className="text-emerald-200"
          />
        </svg>


        <div className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />


        <div className="relative mx-auto grid min-h-screen max-w-[1450px] lg:grid-cols-[1.08fr_0.92fr]">
          <section className="flex px-6 py-8 sm:px-10 lg:px-16 lg:py-10 xl:px-20">
            <div className="mx-auto flex w-full max-w-[700px] flex-col">
              <button
                type="button"
                onClick={() =>
                  navigate("/")
                }
                className="w-fit text-left"
              >
                <div className="text-2xl font-extrabold tracking-tight">
                  <span className="text-green-400">
                    Agri
                  </span>

                  <span className="text-white">
                    Nexus
                  </span>
                </div>

                <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.3em] text-green-300/80">
                  By Astrael
                </div>
              </button>


              <div className="flex flex-1 items-center py-10">
                <div className="w-full">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-green-300 backdrop-blur-sm">
                    <span className="h-2 w-2 rounded-full bg-green-400" />

                    Farm intelligence workspace
                  </div>


                  <h1 className="max-w-[620px] text-4xl font-extrabold leading-[1.07] tracking-[-0.035em] sm:text-5xl lg:text-[54px] xl:text-[60px]">
                    Your farm
                    <br />

                    intelligence.
                    <br />

                    <span className="text-green-400">
                      Built around
                      <br />
                      your field.
                    </span>
                  </h1>


                  <p className="mt-6 max-w-[590px] text-base leading-7 text-white/65">
                    Live weather, Sentinel-2 observations,
                    crop diagnostics, and regenerative
                    intelligence in one connected farm
                    workspace.
                  </p>


                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-4 w-4"
                        >
                          <path d="M12 3 5 6v5c0 4.6 2.9 8.5 7 10 4.1-1.5 7-5.4 7-10V6l-7-3Z" />
                          <path d="m9.5 12 1.6 1.6 3.5-3.7" />
                        </svg>
                      </div>

                      <p className="mt-3 text-sm font-semibold">
                        Flexible access
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/45">
                        Account or guest mode
                      </p>
                    </div>


                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-4 w-4"
                        >
                          <path d="M5 5h4v4H5zM15 5h4v4h-4zM5 15h4v4H5zM15 15h4v4h-4z" />
                          <path d="M9 7h6M7 9v6M17 9v6M9 17h6" />
                        </svg>
                      </div>

                      <p className="mt-3 text-sm font-semibold">
                        Live signals
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/45">
                        Weather + Sentinel-2
                      </p>
                    </div>


                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-4 w-4"
                        >
                          <path d="M12 21V10" />
                          <path d="M12 14c-4.5 0-7-2.5-7-7 4.5 0 7 2.5 7 7Z" />
                          <path d="M12 11c4.5 0 7-2.5 7-7-4.5 0-7 2.5-7 7Z" />
                        </svg>
                      </div>

                      <p className="mt-3 text-sm font-semibold">
                        Farm guidance
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/45">
                        Regenerative insights
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>


          <section className="flex items-center justify-center px-6 py-8 sm:px-10 lg:px-12 lg:py-8 xl:px-16">
            <div className="relative w-full max-w-[470px] overflow-hidden rounded-[28px] border border-green-100/80 bg-[#f8f9f8] p-7 text-gray-950 shadow-[0_28px_90px_rgba(0,0,0,0.26),0_0_50px_rgba(34,197,94,0.06)] sm:p-8">
              <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-green-300/80 to-transparent" />


              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 ring-1 ring-green-100">
                  <img
                    src="/agrinexus-icon.svg"
                    alt="AgriNexus"
                    className="h-8 w-8"
                  />
                </div>


                <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.17em] text-green-700">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M12 3 5 6v5c0 4.6 2.9 8.5 7 10 4.1-1.5 7-5.4 7-10V6l-7-3Z" />
                    <path d="m9.5 12 1.6 1.6 3.5-3.7" />
                  </svg>

                  Secure access
                </div>
              </div>


              <div className="mt-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-green-700">
                  Welcome to AgriNexus
                </p>

                <h2 className="mt-3 text-[31px] font-bold leading-[1.12] tracking-[-0.025em] text-gray-950">
                  Choose how to continue
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Sign in to keep your farms private and
                  saved, or explore temporarily as a guest.
                </p>
              </div>


              {error && (
                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}


              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={
                  signingIn ||
                  loading
                }
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-green-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-900 shadow-[0_8px_24px_rgba(22,101,52,0.08)] transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-[0_10px_28px_rgba(22,101,52,0.13)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <GoogleIcon />

                {signingIn
                  ? "Signing in..."
                  : "Continue with Google"}
              </button>


              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />

                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400">
                  or
                </span>

                <div className="h-px flex-1 bg-gray-200" />
              </div>


              <button
                type="button"
                onClick={handleGuestAccess}
                disabled={loading}
                className="w-full rounded-xl border border-green-200 bg-green-50/70 px-5 py-3.5 text-sm font-semibold text-green-800 transition hover:border-green-300 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Starting guest session..."
                  : "Try AgriNexus as Guest"}
              </button>


              <div className="mt-5 flex items-start gap-3 rounded-xl border border-green-100 bg-green-50/65 px-4 py-3">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="mt-0.5 h-4 w-4 shrink-0 text-green-700"
                >
                  <path d="M12 3 5 6v5c0 4.6 2.9 8.5 7 10 4.1-1.5 7-5.4 7-10V6l-7-3Z" />
                  <path d="m9.5 12 1.6 1.6 3.5-3.7" />
                </svg>

                <p className="text-xs leading-5 text-green-900/70">
                  Signed-in farms stay private to your
                  account. Guest farms remain temporary
                  and are not saved.
                </p>
              </div>


              <div className="mt-5 border-t border-gray-200 pt-5">
                <p className="text-center text-[10px] leading-4 text-gray-400">
                  Google sign-in is handled by Google and
                  Firebase. AgriNexus never receives your
                  Google password.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/")
                  }
                  className="mx-auto mt-4 flex items-center gap-2 text-xs font-semibold text-green-700 transition hover:text-green-900"
                >
                  ← Back to AgriNexus
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

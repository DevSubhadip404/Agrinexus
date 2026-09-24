import type { ReactNode } from "react"

import {
  Navigate,
  useLocation,
} from "react-router-dom"

import { useAuth } from "../context/AuthContext"


export default function ProtectedRoute({
  children,
}: {
  children: ReactNode
}) {
  const {
    user,
    loading,
    isGuest,
  } = useAuth()

  const location = useLocation()


  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-3 w-3 animate-pulse rounded-full bg-green-700" />

          <p className="mt-4 text-sm font-semibold text-gray-600">
            Checking access...
          </p>
        </div>
      </main>
    )
  }


  if (!user && !isGuest) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    )
  }


  return children
}

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import {
  onAuthStateChanged,
  type User,
} from "firebase/auth"

import { auth } from "../firebase"
import { signInAsGuest } from "../services/authService"


type AuthContextValue = {
  user: User | null
  loading: boolean
  isGuest: boolean
  startGuestSession: () => Promise<void>
  endGuestSession: () => void
}


const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined)


const GUEST_SESSION_KEY =
  "agrinexus_guest_session"

const GUEST_FARMS_KEY =
  "agrinexus_guest_farms"


export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] =
    useState<User | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [isGuest, setIsGuest] =
    useState(false)


  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (firebaseUser) => {
          setUser(firebaseUser)

          const guest =
            firebaseUser?.isAnonymous === true

          setIsGuest(guest)

          if (guest) {
            sessionStorage.setItem(
              GUEST_SESSION_KEY,
              "true"
            )
          } else {
            sessionStorage.removeItem(
              GUEST_SESSION_KEY
            )
          }

          setLoading(false)
        }
      )

    return unsubscribe
  }, [])


  async function startGuestSession() {
    setLoading(true)

    try {
      await signInAsGuest()

      sessionStorage.setItem(
        GUEST_SESSION_KEY,
        "true"
      )

      setIsGuest(true)
    } finally {
      setLoading(false)
    }
  }


  function endGuestSession() {
    sessionStorage.removeItem(
      GUEST_SESSION_KEY
    )

    sessionStorage.removeItem(
      GUEST_FARMS_KEY
    )

    setIsGuest(false)
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGuest,
        startGuestSession,
        endGuestSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth() {
  const context =
    useContext(AuthContext)

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    )
  }

  return context
}

import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInAnonymously,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth"

import {
  auth,
  googleProvider,
} from "../firebase"


export async function signInWithGoogle(): Promise<User> {
  await setPersistence(
    auth,
    browserLocalPersistence
  )

  const result =
    await signInWithPopup(
      auth,
      googleProvider
    )

  return result.user
}


export async function signInAsGuest(): Promise<User> {
  await setPersistence(
    auth,
    browserSessionPersistence
  )

  const result =
    await signInAnonymously(auth)

  return result.user
}


export async function signOutUser(): Promise<void> {
  await signOut(auth)
}


export async function getAuthToken(): Promise<string> {
  const user = auth.currentUser

  if (!user) {
    throw new Error(
      "Authentication required."
    )
  }

  return user.getIdToken()
}

import { initializeApp } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyDzNsqhGPsvaoD0XSqv4rzy0y-BseHtNU8",
  authDomain: "agrinexus-c5ed9.firebaseapp.com",
  projectId: "agrinexus-c5ed9",
  storageBucket: "agrinexus-c5ed9.firebasestorage.app",
  messagingSenderId: "814758491802",
  appId: "1:814758491802:web:dc344858ebe01dc064d123",
}


const firebaseApp = initializeApp(
  firebaseConfig
)

export const auth = getAuth(firebaseApp)

export const googleProvider =
  new GoogleAuthProvider()

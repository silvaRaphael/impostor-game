import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCWxJp0Lbyi1uxSbE7bYP-rboKs24ZObvA",
  authDomain: "impostor-game-fe9ea.firebaseapp.com",
  projectId: "impostor-game-fe9ea",
  storageBucket: "impostor-game-fe9ea.appspot.com",
  messagingSenderId: "938886189977",
  appId: "1:938886189977:web:0f7d999b19a859c80ef908"
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

export { db }

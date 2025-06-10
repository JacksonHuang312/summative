import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBc7ZCqmN9SHBK1Lso_TqJGVc-hdMVjNrY",
  authDomain: "ics4u-49118.firebaseapp.com",
  projectId: "ics4u-49118",
  storageBucket: "ics4u-49118.firebasestorage.app",
  messagingSenderId: "849184789605",
  appId: "1:849184789605:web:271a36a86d7da46465e28c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, firestore, googleProvider }
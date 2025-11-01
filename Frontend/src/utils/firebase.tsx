import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzaf1vBM1HU1AC6gUEfcMF3Z18E4OpJ_A",
  authDomain: "gitagyan-a33a2.firebaseapp.com",
  projectId: "gitagyan-a33a2",
  storageBucket: "gitagyan-a33a2.firebasestorage.app",
  messagingSenderId: "342745031931",
  appId: "1:342745031931:web:899fda2f2a1e1aa940fc5e",
  measurementId: "G-WTGYBKKD4G"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

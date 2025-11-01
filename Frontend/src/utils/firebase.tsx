import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyA6KzncnCzXDF42iryWwb_q8_l91NFlzvA",
  authDomain: "gitagyan-789bf.firebaseapp.com",
  projectId: "gitagyan-789bf",
  storageBucket: "gitagyan-789bf.firebasestorage.app",
  messagingSenderId: "677791216959",
  appId: "1:677791216959:web:26c779df098fd4e7240f8a",
  measurementId: "G-3V4NNNB85L"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

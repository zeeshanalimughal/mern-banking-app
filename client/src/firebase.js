import { initializeApp } from 'firebase/app'
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCm4fAWCtwr3-qi611sbyJcWQwyDuwWnno",
  authDomain: "react--login-10167.firebaseapp.com",
  projectId: "react--login-10167",
  storageBucket: "react--login-10167.appspot.com",
  messagingSenderId: "294734556907",
  appId: "1:294734556907:web:ea2b2740d582b6e0c258ae"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app)
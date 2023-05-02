import { initializeApp } from 'firebase/app'
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: 'AIzaSyBzJBNBevwI7epSy240L4Czq6dNenwL92Y',
  authDomain: 'bad-bank-react.firebaseapp.com',
  projectId: 'bad-bank-react',
  storageBucket: 'bad-bank-react.appspot.com',
  messagingSenderId: '37906354449',
  appId: '1:37906354449:web:584e593aca587d108a3cb0'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
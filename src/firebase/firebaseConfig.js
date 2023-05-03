import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKG9iv5JKvNdAYWmy6lNtRW_sj77VGpJQ",
  authDomain: "task-manager-53026.firebaseapp.com",
  projectId: "task-manager-53026",
  storageBucket: "task-manager-53026.appspot.com",
  messagingSenderId: "722283108312",
  appId: "1:722283108312:web:0a83dd5f36ac86e1e044ad",
  measurementId: "G-XZGJNZV5LK",
};

// Initialize Firebase'
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const db = getFirestore(app);


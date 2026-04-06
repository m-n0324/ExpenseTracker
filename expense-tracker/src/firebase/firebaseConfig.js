import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLT9fpd6kPnODpk2Qj5552Ycjue3BquV4",
  authDomain: "myexpensetracker-e94d9.firebaseapp.com",
  projectId: "myexpensetracker-e94d9",
  storageBucket: "myexpensetracker-e94d9.firebasestorage.app",
  messagingSenderId: "998630188610",
  appId: "1:998630188610:web:6bf29029c628769f802fdb",
  measurementId: "G-698198SLXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider(); // Fixed: GoogleAuthProvider use kiya hai
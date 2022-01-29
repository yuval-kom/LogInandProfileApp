import { initializeApp } from "firebase/app";
import { getFirestore, Timestamp } from "@firebase/firestore";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  deleteUser,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApdHfF929LDqnWOy_uaCN5ucOU37j1UYg",
  authDomain: "nifty-seat-336216.firebaseapp.com",
  projectId: "nifty-seat-336216",
  storageBucket: "nifty-seat-336216.appspot.com",
  messagingSenderId: "41945770687",
  appId: "1:41945770687:web:30ab92a4f4beef070ef40a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

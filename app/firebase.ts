// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {
    getAuth,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from 'firebase/auth'

import {getFirestore} from '@firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzTU9C5uixZVZyMukFuYw2xD2CvOSYEAs",
  authDomain: "wheelchair-2e5db.firebaseapp.com",
  projectId: "wheelchair-2e5db",
  storageBucket: "wheelchair-2e5db.appspot.com",
  messagingSenderId: "291383799082",
  appId: "1:291383799082:web:840e2bdc10601e904bc253",
  measurementId: "G-N8V54S982J"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()

export const register = (email: string, password: string) => 
createUserWithEmailAndPassword(auth, email, password)

export const login = (email: string, password: string) => 
signInWithEmailAndPassword(auth, email, password)

export const logout = () => signOut(auth)

export const db = getFirestore()
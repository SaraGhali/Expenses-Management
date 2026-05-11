import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration (same as MENA App)
const firebaseConfig = {
  apiKey: 'AIzaSyDPa7tnkr5TSMujl58rMhqjJiCLEQai0QI',
  authDomain: 'expenses-management-syst-4ff4f.firebaseapp.com',
  projectId: 'expenses-management-syst-4ff4f',
  storageBucket: 'expenses-management-syst-4ff4f.firebasestorage.app',
  messagingSenderId: '47465932833',
  appId: '1:47465932833:web:3726c9a11e23a8aa4e9b60',
  measurementId: 'G-XS4X6T5985'
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase services
export const db = getFirestore(app)
export const auth = getAuth(app)

export default app

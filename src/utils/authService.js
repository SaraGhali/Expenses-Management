import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth'
import { auth } from '../firebase.config.js'

export const authService = {
  // Sign up with email and password
  signup: async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) {
        await updateProfile(userCredential.user, { displayName })
      }
      return userCredential.user
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  },

  // Sign in with email and password
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      console.error('Error logging in:', error)
      throw error
    }
  },

  // Sign out
  logout: async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback)
  }
}

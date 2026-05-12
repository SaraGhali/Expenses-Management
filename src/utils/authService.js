import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth'
import { auth } from '../firebase.config.js'

export const authService = {
  signup: async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) {
        await updateProfile(userCredential.user, { displayName })
      }
      return userCredential.user
    } catch (error) {
      throw error
    }
  },

  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      throw error
    }
  },

  logout: async () => {
    try {
      await signOut(auth)
    } catch (error) {
      throw error
    }
  },

  getCurrentUser: () => auth.currentUser,

  onAuthStateChanged: (callback) => onAuthStateChanged(auth, callback)
}
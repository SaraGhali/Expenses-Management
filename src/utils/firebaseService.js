import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where
} from 'firebase/firestore'
import { db } from '../firebase.config.js'

const TRANSACTIONS_COLLECTION = 'transactions'

const parseDateValue = (value) => {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value === 'object') {
    if (typeof value.toDate === 'function') {
      return value.toDate()
    }
    if (typeof value.seconds === 'number') {
      return new Date(value.seconds * 1000 + Math.round((value.nanoseconds || 0) / 1e6))
    }
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export const transactionService = {
  // Add new transaction

  addTransaction: async (userId, transactionData) => {
    try {
      const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
        userId,
        ...transactionData,
        amount: parseFloat(transactionData.amount),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
        })
      return { id: docRef.id, ...transactionData }
    } catch (error) {
      console.error('Error adding transaction:', error)
      throw error
    }
  },

  // UPDATED: Get ALL transactions for ALL users
  getAllTransactions: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, TRANSACTIONS_COLLECTION))
      const transactions = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: parseDateValue(data.createdAt),
          date: parseDateValue(data.date)
        }
      })
      // Sort by creation date descending
      return transactions.sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0))
    } catch (error) {
      console.error('Error fetching all transactions:', error)
      throw error
    }
  },

  // Keep for specific use cases (e.g., Profile page)
  getUserTransactions: async (userId) => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, TRANSACTIONS_COLLECTION), where('userId', '==', userId))
      )
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: parseDateValue(doc.data().createdAt)
      }))
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  },

  getAllUsers: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'))
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  updateTransaction: async (transactionId, updates) => {
    try {
      const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId)
      await updateDoc(transactionRef, {
        ...updates,
        amount: parseFloat(updates.amount),
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating transaction:', error)
      throw error
    }
  },

  deleteTransaction: async (transactionId) => {
    try {
      await deleteDoc(doc(db, TRANSACTIONS_COLLECTION, transactionId))
    } catch (error) {
      console.error('Error deleting transaction:', error)
      throw error
    }
  },

  // UPDATED: Get summary based on ALL transactions for ALL users
  getMonthlySummary: async (userId, year, month) => {
    try {
      // Fetch all transactions regardless of userId
      const allTransactions = await transactionService.getAllTransactions()
      
      const filtered = allTransactions.filter(trans => {
        // Parse date from either 'date' or 'createdAt' field
        const transDate = trans.date instanceof Date ? trans.date : (trans.createdAt instanceof Date ? trans.createdAt : null)
        
        if (!transDate) return false
        
        const y = transDate.getFullYear()
        const m = transDate.getMonth()
        
        return y === year && m === month - 1
      })

      let income = 0
      let expenses = 0
      filtered.forEach(trans => {
        const amt = parseFloat(trans.amount) || 0
        amt > 0 ? (income += amt) : (expenses += Math.abs(amt))
      })

      return { income, expenses, net: income - expenses, transactions: filtered }
    } catch (error) {
      console.error('Error getting summary:', error)
      throw error
    }
  }
}

export const expenseService = transactionService
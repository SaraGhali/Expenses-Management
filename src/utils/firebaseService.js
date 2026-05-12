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

// Transactions Collection (handles both income and expenses)
const TRANSACTIONS_COLLECTION = 'transactions'

export const transactionService = {
  // Add new transaction (income or expense)
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
  // Get all transactions 
  getAllTransactions: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, TRANSACTIONS_COLLECTION))
      const transactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      return transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
    } catch (error) {
      console.error('Error fetching all transactions:', error)
      throw error
    }
  },
  // Get all transactions for a user
  getUserTransactions: async (userId) => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, TRANSACTIONS_COLLECTION),
          where('userId', '==', userId)
        )
      )
      const transactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      return transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  },

  // Get all registered users from Firestore users collection
  getAllUsers: async () => {
    try {
      const usersRef = collection(db, 'users')
      const querySnapshot = await getDocs(usersRef)
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      return users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  addUser: async (userData) => {
    try {
      const timestamp = new Date().toISOString()
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: timestamp,
        updatedAt: timestamp
      })
      return { id: docRef.id, ...userData, createdAt: timestamp, updatedAt: timestamp }
    } catch (error) {
      console.error('Error adding user:', error)
      throw error
    }
  },

  updateUser: async (userId, updates) => {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  deleteUser: async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId))
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },

  // Update transaction
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

  // Delete transaction
  deleteTransaction: async (transactionId) => {
    try {
      await deleteDoc(doc(db, TRANSACTIONS_COLLECTION, transactionId))
    } catch (error) {
      console.error('Error deleting transaction:', error)
      throw error
    }
  },

  // Get transaction by ID
  getTransaction: async (transactionId) => {
    try {
      const docSnap = await getDoc(doc(db, TRANSACTIONS_COLLECTION, transactionId))
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      }
      return null
    } catch (error) {
      console.error('Error fetching transaction:', error)
      throw error
    }
  },

  // Get transactions for a specific month
  getMonthTransactions: async (userId, year, month) => {
    try {
      const transactions = await transactionService.getUserTransactions(userId)
      return transactions.filter(trans => {
        const date = new Date(trans.date)
        return date.getFullYear() === year && date.getMonth() === month - 1
      })
    } catch (error) {
      console.error('Error fetching month transactions:', error)
      throw error
    }
  },

  // Get monthly summary (income vs expenses)
  getMonthlySummary: async (userId, year, month) => {
    try {
      const transactions = await transactionService.getMonthTransactions(userId, year, month)
      
      let income = 0
      let expenses = 0

      transactions.forEach(trans => {
        if (trans.amount > 0) {
          income += trans.amount
        } else {
          expenses += Math.abs(trans.amount)
        }
      })

      return {
        income,
        expenses,
        net: income - expenses,
        transactions
      }
    } catch (error) {
      console.error('Error getting monthly summary:', error)
      throw error
    }
  },

  // Get yearly summary
  getYearlySummary: async (userId, year) => {
    try {
      const transactions = await transactionService.getUserTransactions(userId)
      const yearTransactions = transactions.filter(trans => {
        const date = new Date(trans.date)
        return date.getFullYear() === year
      })

      const monthlyData = {}

      yearTransactions.forEach(transaction => {
        const date = new Date(transaction.date)
        const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' })

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { income: 0, expenses: 0, net: 0 }
        }

        if (transaction.amount > 0) {
          monthlyData[monthKey].income += transaction.amount
        } else {
          monthlyData[monthKey].expenses += Math.abs(transaction.amount)
        }
        monthlyData[monthKey].net = monthlyData[monthKey].income - monthlyData[monthKey].expenses
      })

      return { monthlyData, transactions: yearTransactions }
    } catch (error) {
      console.error('Error getting yearly summary:', error)
      throw error
    }
  }
}

// Backward compatibility export
export const expenseService = transactionService

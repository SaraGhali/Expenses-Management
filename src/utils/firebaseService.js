import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    where,
    runTransaction,
    serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase.config.js'

const TRANSACTIONS_COLLECTION = 'transactions'
const USERS_COLLECTION = 'users'

/**
 * Helper to normalize date values from Firestore (Timestamps, Strings, or Dates)
 */
const parseDateValue = (value) => {
    if (!value) return null
    if (value instanceof Date) return value
    if (typeof value === 'object') {
        if (typeof value.toDate === 'function') return value.toDate()
        if (typeof value.seconds === 'number') {
            return new Date(value.seconds * 1000 + Math.round((value.nanoseconds || 0) / 1e6))
        }
    }
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
}

export const transactionService = {
    /**
     * ATOMIC: Adds a transaction and updates the user's total balance.
     */
    addTransaction: async (userId, transactionData) => {
        const amount = parseFloat(transactionData.amount)
        const userRef = doc(db, USERS_COLLECTION, userId)
        const transactionRef = doc(collection(db, TRANSACTIONS_COLLECTION))

        try {
            await runTransaction(db, async (transaction) => {
                const userSnap = await transaction.get(userRef)
                if (!userSnap.exists()) throw new Error("User does not exist")

                const newBalance = (userSnap.data().balance || 0) + amount

                // Update User Balance
                transaction.update(userRef, { 
                    balance: newBalance,
                    updatedAt: serverTimestamp() 
                })

                // Create Transaction
                transaction.set(transactionRef, {
                    ...transactionData,
                    userId,
                    amount,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            })
            return { id: transactionRef.id, ...transactionData, amount }
        } catch (error) {
            console.error('Error in addTransaction:', error)
            throw error
        }
    },

    /**
     * ATOMIC: Deletes a transaction and reverses its impact on the user's balance.
     */
    deleteTransaction: async (transactionId) => {
        const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId)

        try {
            await runTransaction(db, async (transaction) => {
                const transSnap = await transaction.get(transactionRef)
                if (!transSnap.exists()) throw new Error("Transaction not found")

                const { userId, amount } = transSnap.data()
                const userRef = doc(db, USERS_COLLECTION, userId)
                const userSnap = await transaction.get(userRef)

                if (userSnap.exists()) {
                    const newBalance = (userSnap.data().balance || 0) - amount
                    transaction.update(userRef, { balance: newBalance })
                }

                transaction.delete(transactionRef)
            })
        } catch (error) {
            console.error('Error in deleteTransaction:', error)
            throw error
        }
    },

    /**
     * ATOMIC: Updates an existing transaction and calculates the balance difference.
     */
    updateTransaction: async (transactionId, updates) => {
        const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId)
        const newAmount = parseFloat(updates.amount)

        try {
            await runTransaction(db, async (transaction) => {
                const transSnap = await transaction.get(transactionRef)
                if (!transSnap.exists()) throw new Error("Transaction not found")

                const oldData = transSnap.data()
                const userRef = doc(db, USERS_COLLECTION, oldData.userId)
                const userSnap = await transaction.get(userRef)

                if (userSnap.exists()) {
                    // Formula: NewBalance = CurrentBalance - OldAmount + NewAmount
                    const balanceDiff = newAmount - oldData.amount
                    const newBalance = (userSnap.data().balance || 0) + balanceDiff
                    transaction.update(userRef, { balance: newBalance })
                }

                transaction.update(transactionRef, {
                    ...updates,
                    amount: newAmount,
                    updatedAt: serverTimestamp()
                })
            })
        } catch (error) {
            console.error('Error in updateTransaction:', error)
            throw error
        }
    },

    /**
     * OPTIMIZED: Fetches all transactions sorted by the server.
     */
    getAllTransactions: async () => {
        try {
            const q = query(collection(db, TRANSACTIONS_COLLECTION), orderBy('createdAt', 'desc'))
            const querySnapshot = await getDocs(q)
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: parseDateValue(doc.data().createdAt),
                // date: parseDateValue(doc.data().date)
            }))
        } catch (error) {
            console.error('Error fetching all transactions:', error)
            throw error
        }
    },

    /**
     * OPTIMIZED: Server-side filtering for user-specific history.
     */
    getUserTransactions: async (userId) => {
        try {
            const q = query(collection(db, TRANSACTIONS_COLLECTION), where('userId', '==', userId), orderBy('createdAt', 'desc'))
            const querySnapshot = await getDocs(q)
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: parseDateValue(doc.data().createdAt)
            }))
        } catch (error) {
            console.error('Error fetching user transactions:', error); throw error
        }
    },

    /**
     * OPTIMIZED: Fetches specific monthly summary with balance totals.
     */
    getMonthlySummary: async (userId, year, month) => {
        try {
            let allTransactions =[];
            if (!userId || userId === null)  allTransactions= await transactionService.getAllTransactions();
            else allTransactions = await transactionService.getUserTransactions(userId)
            
            const filtered = allTransactions.filter(trans => {
                const transDate = trans.createdAt 
                if (!transDate) return false
                return transDate.getFullYear() === year && transDate.getMonth() === month - 1
            })

            let income = 0
            let expenses = 0
            filtered.forEach(trans => {
                const amt = trans.amount || 0
                amt > 0 ? (income += amt) : (expenses += Math.abs(amt))
            })

            return { income, expenses, net: income - expenses, transactions: filtered }
        } catch (error) {
            console.error('Error getting summary:', error)
            throw error
        }
    },

    getAllUsers: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, USERS_COLLECTION))
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        } catch (error) {
            console.error('Error fetching users:', error)
            throw error
        }
    }
}

export const expenseService = transactionService
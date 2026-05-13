import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    orderBy,
    query,
    where,
    runTransaction,
    serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase.config.js'

const TRANSACTIONS_COLLECTION = 'transactions'
const USERS_COLLECTION = 'users'

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
    addTransaction: async (userId, transactionData) => {
        const amount = parseFloat(transactionData.amount)
        const userRef = doc(db, USERS_COLLECTION, userId)
        const transactionRef = doc(collection(db, TRANSACTIONS_COLLECTION))

        try {
            await runTransaction(db, async (transaction) => {
                const userSnap = await transaction.get(userRef)
                if (!userSnap.exists()) throw new Error("User does not exist")
                const newBalance = (userSnap.data().balance || 0) + amount
                transaction.update(userRef, { balance: newBalance, updatedAt: serverTimestamp() })
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
            console.error('Error in addTransaction:', error); throw error
        }
    },


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
            console.error('Error in deleteTransaction:', error); throw error
        }
    },

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

    getMonthlySummary: async (userId, year, month) => {
        try {
            const allTransactions = await transactionService.getUserTransactions(userId)
            const filtered = allTransactions.filter(trans => {
                const transDate = parseDateValue(trans.date) || trans.createdAt
                if (!transDate) return false
                return transDate.getFullYear() === year && transDate.getMonth() === month - 1
            })
            let income = 0; let expenses = 0
            filtered.forEach(trans => {
                const amt = trans.amount || 0
                amt > 0 ? (income += amt) : (expenses += Math.abs(amt))
            })
            return { income, expenses, net: income - expenses, transactions: filtered }
        } catch (error) {
            console.error('Error getting summary:', error); throw error
        }
    },

    getAllUsers: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, USERS_COLLECTION))
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        } catch (error) {
            console.error('Error fetching users:', error); throw error
        }
    },

    addUser: async (payload) => {
        return await addDoc(collection(db, USERS_COLLECTION), { ...payload, createdAt: serverTimestamp() })
    },

    updateUser: async (id, payload) => {
        const userRef = doc(db, USERS_COLLECTION, id)
        return await updateDoc(userRef, { ...payload, updatedAt: serverTimestamp() })
    },

    deleteUser: async (id) => {
        return await deleteDoc(doc(db, USERS_COLLECTION, id))
    }
}
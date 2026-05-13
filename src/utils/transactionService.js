import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    where,
    runTransaction,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase.config.js';

const TRANSACTIONS_COLLECTION = 'transactions';
const USERS_COLLECTION = 'users';

const parseDateValue = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'object') {
        if (typeof value.toDate === 'function') return value.toDate();
        if (typeof value.seconds === 'number') {
            return new Date(value.seconds * 1000 + Math.round((value.nanoseconds || 0) / 1e6));
        }
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

export const transactionService = {
    // ATOMIC: Adds transaction and increases/decreases user balance
    addTransaction: async (userId, transactionData) => {
        const amount = parseFloat(transactionData.amount);
        const userRef = doc(db, USERS_COLLECTION, userId);
        const transactionRef = doc(collection(db, TRANSACTIONS_COLLECTION));

        try {
            await runTransaction(db, async (transaction) => {
                const userSnap = await transaction.get(userRef);
                if (!userSnap.exists()) throw new Error("User does not exist");

                const newBalance = (userSnap.data().balance || 0) + amount;

                transaction.update(userRef, { 
                    balance: newBalance,
                    updatedAt: serverTimestamp() 
                });

                transaction.set(transactionRef, {
                    ...transactionData,
                    userId,
                    amount,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            });
            return { id: transactionRef.id, ...transactionData, amount };
        } catch (error) {
            console.error('Add Transaction Error:', error);
            throw error;
        }
    },

    // ATOMIC: Removes transaction and reverts the balance change
    deleteTransaction: async (transactionId) => {
        const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);

        try {
            await runTransaction(db, async (transaction) => {
                const transSnap = await transaction.get(transactionRef);
                if (!transSnap.exists()) throw new Error("Transaction not found");

                const { userId, amount } = transSnap.data();
                const userRef = doc(db, USERS_COLLECTION, userId);
                const userSnap = await transaction.get(userRef);

                if (userSnap.exists()) {
                    const newBalance = (userSnap.data().balance || 0) - amount;
                    transaction.update(userRef, { balance: newBalance });
                }

                transaction.delete(transactionRef);
            });
        } catch (error) {
            console.error('Delete Transaction Error:', error);
            throw error;
        }
    },

    getAllTransactions: async () => {
        try {
            const q = query(collection(db, TRANSACTIONS_COLLECTION), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: parseDateValue(doc.data().createdAt),
                date: parseDateValue(doc.data().date)
            }));
        } catch (error) {
            console.error('Fetch Error:', error);
            throw error;
        }
    },

    getAllUsers: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Fetch Users Error:', error);
            throw error;
        }
    }
};
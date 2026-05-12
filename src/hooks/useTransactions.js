import { useCallback, useEffect, useState } from 'react'
import { transactionService } from '../utils/firebaseService'

export function useTransactions(userId) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTransactions = useCallback(async () => {
    if (!userId) {
      setTransactions([])
      setError(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await transactionService.getUserTransactions(userId)
      setTransactions(data || [])
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError(err?.message || 'Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    let active = true

    const load = async () => {
      if (!active) return
      await fetchTransactions()
    }

    load()

    return () => {
      active = false
    }
  }, [fetchTransactions])

  const addTransaction = async (transactionData) => {
    if (!userId) throw new Error('User not authenticated')
    try {
      await transactionService.addTransaction(userId, transactionData)
      await fetchTransactions()
    } catch (err) {
      setError(err?.message || 'Failed to add transaction')
      throw err
    }
  }

  const deleteTransaction = async (id) => {
    try {
      await transactionService.deleteTransaction(id)
      await fetchTransactions()
    } catch (err) {
      setError(err?.message || 'Failed to delete transaction')
      throw err
    }
  }

  const updateTransaction = async (id, data) => {
    try {
      await transactionService.updateTransaction(id, data)
      await fetchTransactions()
    } catch (err) {
      setError(err?.message || 'Failed to update transaction')
      throw err
    }
  }

  const refreshTransactions = async () => {
    await fetchTransactions()
  }

  return {
    transactions,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    refreshTransactions,
  }
}


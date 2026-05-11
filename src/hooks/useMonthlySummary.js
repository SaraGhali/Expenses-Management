import { useEffect, useState, useCallback } from 'react'
import { transactionService } from '../utils/firebaseService'

export function useMonthlySummary(userId, year, month) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSummary = useCallback(async () => {
    if (!userId || !year || !month) {
      setSummary(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await transactionService.getMonthlySummary(userId, year, month)
      setSummary(data)
    } catch (err) {
      console.error('Error fetching monthly summary:', err)
      setError(err.message || 'Failed to load summary')
    } finally {
      setLoading(false)
    }
  }, [userId, year, month])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return { summary, loading, error, refreshSummary: fetchSummary }
}

import { useEffect, useState, useCallback } from 'react'
import { transactionService } from '../utils/firebaseService'

export function useMonthlySummary(year, month) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSummary = useCallback(async () => {
    if (!year || !month) {
      setSummary(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await transactionService.getMonthlySummary(year, month)
      setSummary(data)
    } catch (err) {
      console.error('Error fetching monthly summary:', err)
      setError(err.message || 'Failed to load summary')
    } finally {
      setLoading(false)
    }
  }, [year, month])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return { summary, loading, error, refreshSummary: fetchSummary }
}

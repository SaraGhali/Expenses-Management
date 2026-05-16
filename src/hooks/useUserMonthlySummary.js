import { useState, useEffect, useCallback } from 'react'
import { transactionService } from '../utils/firebaseService'

export function useUserMonthlySummary(year, month, userId = null) {
  const [userSummary, setUserSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch summary and users in parallel
      const [summaryData, allUsers] = await Promise.all([
        transactionService.getMonthlySummary(userId, year, month)      ])

      setUserSummary(summaryData)

    } catch (err) {
      console.error('Summary fetch error:', err)
      setError(err.message || 'Failed to load summary')
    } finally {
      setLoading(false)
    }
  }, [year, month])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { userSummary, loading, error, refreshUserSummary: fetchData }
}
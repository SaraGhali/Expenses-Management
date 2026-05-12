import { useState, useEffect, useCallback } from 'react'
import { transactionService } from '../utils/firebaseService'

export function useMonthlySummary(year, month) {
  const [summary, setSummary] = useState(null)
  const [usersMap, setUsersMap] = useState({}) // New state for user names
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch summary and users in parallel
      const [summaryData, allUsers] = await Promise.all([
        transactionService.getMonthlySummary(null, year, month),
        transactionService.getAllUsers()
      ])

      setSummary(summaryData)

      // Create a lookup map: { "userId123": { name: "John Doe", ... } }
      const map = {}
      if (allUsers && Array.isArray(allUsers)) {
        allUsers.forEach(u => {
          map[u.id] = u
        })
      }
      setUsersMap(map)

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

  return { summary, usersMap, loading, error, refreshSummary: fetchData }
}
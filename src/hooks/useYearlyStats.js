import { useEffect, useState, useCallback } from 'react'
import { transactionService } from '../utils/firebaseService'

export function useYearlyStats(userId, year) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = useCallback(async () => {
    if (!userId || !year) {
      setStats(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Get all transactions for the year
      const allTransactions = await transactionService.getUserTransactions(userId)
      const yearTransactions = allTransactions.filter(trans => {
        const date = new Date(trans.date)
        return date.getFullYear() === year
      })

      // Calculate totals
      let totalIncome = 0
      let totalExpenses = 0

      // Calculate monthly data
      const monthlyData = []
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      
      for (let month = 0; month < 12; month++) {
        let monthIncome = 0
        let monthExpenses = 0

        yearTransactions.forEach(trans => {
          const date = new Date(trans.date)
          if (date.getMonth() === month) {
            if (trans.amount > 0) {
              monthIncome += trans.amount
            } else {
              monthExpenses += Math.abs(trans.amount)
            }
          }
        })

        totalIncome += monthIncome
        totalExpenses += monthExpenses

        monthlyData.push({
          month: monthNames[month],
          income: monthIncome,
          expenses: monthExpenses,
          net: monthIncome - monthExpenses
        })
      }

      // Calculate category breakdown
      const categoryData = {}
      yearTransactions.forEach(trans => {
        if (!categoryData[trans.category]) {
          categoryData[trans.category] = { name: trans.category, income: 0, expenses: 0 }
        }
        if (trans.amount > 0) {
          categoryData[trans.category].income += trans.amount
        } else {
          categoryData[trans.category].expenses += Math.abs(trans.amount)
        }
      })

      const categories = Object.values(categoryData)

      setStats({
        income: totalIncome,
        expenses: totalExpenses,
        net: totalIncome - totalExpenses,
        transactionCount: yearTransactions.length,
        monthlyData,
        categories
      })
    } catch (err) {
      console.error('Error fetching yearly stats:', err)
      setError(err.message || 'Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }, [userId, year])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, loading, error, refreshStats: fetchStats }
}

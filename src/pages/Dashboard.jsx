import DashboardIcon from '@mui/icons-material/Dashboard'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { transactionService } from '../utils/firebaseService'
import { i18n } from '../i18n/i18n'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlyNet: 0,
    totalTransactions: 0
  })
  const [loading, setLoading] = useState(true)

  const t = (key) => i18n.t(key)
  const userId = 'test-user' // Replace with actual auth

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()

      // Get all transactions
      const allTransactions = await transactionService.getUserTransactions(userId)

      // Get current month transactions
      const monthTransactions = await transactionService.getMonthlySummary(userId, currentYear, currentMonth)

      // Calculate totals
      let totalIncome = 0
      let totalExpenses = 0

      allTransactions.forEach(trans => {
        if (trans.amount > 0) {
          totalIncome += trans.amount
        } else {
          totalExpenses += Math.abs(trans.amount)
        }
      })

      setStats({
        totalIncome,
        totalExpenses,
        monthlyIncome: monthTransactions.income,
        monthlyExpenses: monthTransactions.expenses,
        monthlyNet: monthTransactions.net,
        totalTransactions: allTransactions.length
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h3" component="h1">
          {t('dashboard.title')}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Income */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.9 }} />
                <Box>
                  <Typography sx={{ opacity: 0.9 }} gutterBottom>
                    {t('dashboard.income')}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    +${stats.totalIncome.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Expenses */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingDownIcon sx={{ fontSize: 40, opacity: 0.9 }} />
                <Box>
                  <Typography sx={{ opacity: 0.9 }} gutterBottom>
                    {t('dashboard.totalExpenses')}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    -${stats.totalExpenses.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Income */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            color: 'white',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.9 }} />
                <Box>
                  <Typography sx={{ opacity: 0.9 }} gutterBottom>
                    {t('dashboard.thisMonth')}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    +${stats.monthlyIncome.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Expenses */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
            color: 'white',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingDownIcon sx={{ fontSize: 40, opacity: 0.9 }} />
                <Box>
                  <Typography sx={{ opacity: 0.9 }} gutterBottom>
                    {t('dashboard.monthlyBudget')}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    -${stats.monthlyExpenses.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Net */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: stats.monthlyNet >= 0
              ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
              : 'linear-gradient(135deg, #f44336 0%, #da190b 100%)',
            color: 'white',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.9 }} />
                <Box>
                  <Typography sx={{ opacity: 0.9 }} gutterBottom>
                    {t('dashboard.remaining')}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    ${stats.monthlyNet.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Transactions */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Transactions
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {stats.totalTransactions}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

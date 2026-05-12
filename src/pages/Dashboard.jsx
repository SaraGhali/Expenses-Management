import DashboardIcon from '@mui/icons-material/Dashboard'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, Button, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuthUser } from '../hooks/useAuthUser'
import { useTransactions } from '../hooks/useTransactions'
import { i18n } from '../i18n/i18n'
import StatCard from '../components/ui/StatCard'



export default function Dashboard() {
  const t = (key) => i18n.t(key)
  const navigate = useNavigate()
  const { user, initializing } = useAuthUser()
  const { transactions, loading } = useTransactions(user?.uid)

  if (initializing || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

 

  // Calculate statistics
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  let totalIncome = 0
  let totalExpenses = 0
  let monthlyIncome = 0
  let monthlyExpenses = 0

  transactions.forEach(trans => {
    const transDate = new Date(trans.date)
    const isCurrentMonth = transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear

    if (trans.amount > 0) {
      totalIncome += trans.amount
      if (isCurrentMonth) monthlyIncome += trans.amount
    } else {
      totalExpenses += Math.abs(trans.amount)
      if (isCurrentMonth) monthlyExpenses += Math.abs(trans.amount)
    }
  })

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 4,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 30px 70px rgba(0,0,0,0.18)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <DashboardIcon sx={{ fontSize: 42, color: 'primary.main' }} />
              <Typography variant="h3" component="h1" sx={{ fontWeight: 800 }}>
                {t('dashboard.title')}
              </Typography>
            </Box>
            <Typography sx={{ color: 'text.secondary', maxWidth: 680 }}>
              {t('dashboard.welcomeMessage') || 'A beautiful and easy way to track expenses, incomes, and monthly goals.'}
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gap: 2, width: '100%', maxWidth: 280 }}>
            <Card sx={{ background: 'rgba(255,255,255,0.08)', p: 3, minWidth: 240 }}>
              <CardContent>
                <Typography sx={{ color: 'text.secondary', mb: 1 }}>Transactions</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {transactions.length}
                </Typography>
                <Typography sx={{ mt: 1, color: 'text.secondary' }}>
                  {t('dashboard.totalTransactions') || 'Total recorded transactions'}
                </Typography>
              </CardContent>
            </Card>
            <Button variant="contained" onClick={() => navigate('/transactions')}>
              {t('common.addTransaction')}
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('dashboard.income')}
            value={`+$${totalIncome.toFixed(2)}`}
            icon={TrendingUpIcon}
            gradient={['#667eea', '#764ba2']}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('dashboard.totalExpenses')}
            value={`-$${totalExpenses.toFixed(2)}`}
            icon={TrendingDownIcon}
            gradient={['#f093fb', '#f5576c']}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('dashboard.thisMonth')}
            value={`+$${monthlyIncome.toFixed(2)}`}
            icon={TrendingUpIcon}
            gradient={['#4caf50', '#45a049']}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('dashboard.monthlyBudget')}
            value={`-$${monthlyExpenses.toFixed(2)}`}
            icon={TrendingDownIcon}
            gradient={['#ff9800', '#f57c00']}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <CardContent>
              <Typography gutterBottom sx={{ color: 'text.secondary', fontWeight: 700 }}>
                {t('dashboard.remaining')}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                ${(monthlyIncome - monthlyExpenses).toFixed(2)}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {t('dashboard.netBalanceDescription') || 'Your remaining balance for the current month.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <CardContent>
              <Typography gutterBottom sx={{ color: 'text.secondary', fontWeight: 700 }}>
                {t('dashboard.totalTransactions') || 'Transactions overview'}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                {transactions.length}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {t('dashboard.transactionSummary') || 'A snapshot of your total activity so far.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

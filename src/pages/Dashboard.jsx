import DashboardIcon from '@mui/icons-material/Dashboard'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material'
import { useAuthUser } from '../hooks/useAuthUser'
import { useTransactions } from '../hooks/useTransactions'
import { i18n } from '../i18n/i18n'

const StatCard = ({ title, value, icon: Icon, gradient, loading }) => (
  <Card sx={{
    background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
    color: 'white',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
    }
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Icon sx={{ fontSize: 40, opacity: 0.9 }} />
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ opacity: 0.9 }} gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {loading ? <CircularProgress size={20} color="inherit" /> : value}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
)

export default function Dashboard() {
  const t = (key) => i18n.t(key)
  const { user, initializing } = useAuthUser()
  const { transactions, loading } = useTransactions(user?.uid)

  if (initializing || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return (
      <Box sx={{ py: 8 }}>
        <Typography variant="h6" align="center">
          Please login to see your dashboard.
        </Typography>
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h3" component="h1">
          {t('dashboard.title')}
        </Typography>
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

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: monthlyIncome - monthlyExpenses >= 0
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
                    ${(monthlyIncome - monthlyExpenses).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

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
                    {transactions.length}
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

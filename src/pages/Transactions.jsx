import DeleteIcon from '@mui/icons-material/Delete'
import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Alert
} from '@mui/material'
import { transactionService } from '../utils/firebaseService'
import { i18n } from '../i18n/i18n'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [usersMap, setUsersMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const t = (key) => i18n.t(key)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [all, users] = await Promise.all([
        transactionService.getAllTransactions(),
        transactionService.getAllUsers()
      ])

      setTransactions(all)
      setUsersMap(
        users.reduce((map, user) => {
          map[user.id] = user
          return map
        }, {})
      )
    } catch (err) {
      setError(err.message || t('transactions.loadError'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm(t('transactions.deleteConfirmation'))) return

    try {
      setLoading(true)
      await transactionService.deleteTransaction(id)
      setSnackbar({ open: true, message: t('transactions.deleteSuccess'), severity: 'success' })
      await fetchData()
    } catch (err) {
      setSnackbar({ open: true, message: err.message || t('transactions.deleteError'), severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.amount > 0) {
        acc.income += transaction.amount
      } else {
        acc.expenses += Math.abs(transaction.amount)
      }
      return acc
    },
    { income: 0, expenses: 0 }
  )

  const net = totals.income - totals.expenses

  const getUserName = (transaction) => {
    if (transaction.userName) return transaction.userName
    const user = usersMap[transaction.userId]
    return user?.displayName || user?.name || transaction.userId || '—'
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 60px rgba(0,0,0,0.16)' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 3 }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
              {t('navigation.transactions')}
            </Typography>
            <Typography sx={{ color: 'text.secondary', maxWidth: 700 }}>
              {t('transactions.description') || 'Overview of all user transactions, with income, expenses, and net totals in one place.'}
            </Typography>
          </Box>
          <Card sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ color: 'text.secondary', mb: 1 }}>{t('transactions.totalTransactions')}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{transactions.length}</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Typography color="inherit" gutterBottom>
                {t('dashboard.totalIncome')}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                +${totals.income.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Typography color="inherit" gutterBottom>
                {t('dashboard.totalExpenses')}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                -${totals.expenses.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: net >= 0 ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)' : 'linear-gradient(135deg, #f44336 0%, #da190b 100%)', color: 'white' }}>
            <CardContent>
              <Typography color="inherit" gutterBottom>
                {t('common.netBalance')}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ${net.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {transactions.length === 0 ? (
        <Alert severity="info">{t('transactions.noTransactions')}</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto', borderRadius: 3, p: 1, bgcolor: 'rgba(255,255,255,0.05)' }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' ,color: 'black'}}>
                <TableCell>{t('common.date')}</TableCell>
                <TableCell>{t('transactions.createdAt')}</TableCell>
                <TableCell>{t('common.user')}</TableCell>
                <TableCell>{t('common.description')}</TableCell>
                <TableCell>{t('common.category')}</TableCell>
                <TableCell align="right">{t('common.amount')}</TableCell>
                <TableCell align="center">{t('common.type')}</TableCell>
                <TableCell align="center">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : '—'}</TableCell>
                  <TableCell>{getUserName(transaction)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell align="right">
                    <Typography sx={{ color: transaction.amount > 0 ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={transaction.amount > 0 ? t('common.income') : t('common.expense')} color={transaction.amount > 0 ? 'success' : 'error'} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => handleDeleteTransaction(transaction.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

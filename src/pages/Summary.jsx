import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import HistoryIcon from '@mui/icons-material/History'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthUser } from '../hooks/useAuthUser'
import { useMonthlySummary } from '../hooks/useMonthlySummary'
import { i18n } from '../i18n/i18n'
import { TRANSACTION_CATEGORIES } from '../constants'
import { transactionService } from '../utils/firebaseService'

const months = Array.from({ length: 12 }, (_, index) =>
  new Intl.DateTimeFormat(i18n.getLanguage(), { month: 'long' }).format(new Date(2020, index, 1))
)

export default function Summary() {
  const navigate = useNavigate()
  const { user, initializing } = useAuthUser()
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const { summary, loading, error, refreshSummary } = useMonthlySummary(selectedYear, selectedMonth)

  const [editingId, setEditingId] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0]
  })

  const t = (key) => i18n.t(key)

  if (initializing || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }


  const handleDeleteTransaction = async (id) => {
    if (window.confirm(t('common.confirmDelete'))) {
      try {
        await transactionService.deleteTransaction(id)
        await refreshSummary()
      } catch (err) {
        console.error('Error deleting transaction:', err)
        alert(err.message || t('common.errorDeleting'))
      }
    }
  }

  const handleEditTransaction = (transaction) => {
    const dateValue = transaction.date instanceof Date
      ? transaction.date.toISOString().split('T')[0]
      : String(transaction.date || new Date().toISOString()).split('T')[0]

    setEditingId(transaction.id)
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: dateValue
    })
    setOpenDialog(true)
  }

  const handleSaveTransaction = async () => {
    if (!formData.description || !formData.amount) {
      alert(t('expenses.fillAllFields'))
      return
    }

    try {
      if (editingId) {
        await transactionService.updateTransaction(editingId, {
          ...formData,
          amount: parseFloat(formData.amount)
        })
        setEditingId(null)
      } else {
        await transactionService.addTransaction(user.uid, {
          ...formData,
          amount: parseFloat(formData.amount)
        })
      }

      setOpenDialog(false)
      setFormData({
        description: '',
        amount: '',
        category: 'Other',
        date: new Date().toISOString().split('T')[0]
      })
      await refreshSummary()
    } catch (error) {
      console.error('Error saving transaction:', error)
      alert(error.message || t('common.errorSaving'))
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingId(null)
    setFormData({
      description: '',
      amount: '',
      category: 'Other',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  const formatTransactionDate = (transaction) => {
    if (transaction.date) {
      const date = new Date(transaction.date)
      if (!Number.isNaN(date.getTime())) return date.toLocaleDateString()
    }
    if (transaction.createdAt) {
      const date = new Date(transaction.createdAt)
      if (!Number.isNaN(date.getTime())) return date.toLocaleDateString()
    }
    return '—'
  }

  const monthlyTotals = summary?.transactions.reduce(
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

  const monthlyNet = monthlyTotals ? monthlyTotals.income - monthlyTotals.expenses : 0

  return (
    <Box>
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 70px rgba(0,0,0,0.18)' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <HistoryIcon sx={{ fontSize: 42, color: 'primary.main' }} />
              <Typography variant="h3" component="h1" sx={{ fontWeight: 800 }}>
                {t('navigation.summary')}
              </Typography>
            </Box>
            <Typography sx={{ color: 'text.secondary', maxWidth: 700 }}>
              {t('summary.description') || 'Track monthly income, expenses and your overall balance in one elegant view.'}
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gap: 2, width: '100%', maxWidth: 320 }}>
            <FormControl fullWidth>
              <InputLabel>{t('common.month')}</InputLabel>
              <Select
                value={selectedMonth}
                label={t('common.month')}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month, index) => (
                  <MenuItem key={index} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t('common.year')}</InputLabel>
              <Select
                value={selectedYear}
                label={t('common.year')}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map(year => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Typography color="inherit" gutterBottom>
                  {t('dashboard.totalIncome')}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  +${summary.income.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Typography color="inherit" gutterBottom>
                  {t('dashboard.totalExpenses')}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  -${Math.abs(summary.expenses).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: summary.net >= 0
                ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                : 'linear-gradient(135deg, #f44336 0%, #da190b 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Typography color="inherit" gutterBottom>
                  {t('common.netBalance')}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  ${summary.net.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {t('common.transactions')}
                </Typography>
                <Typography variant="h4">
                  {summary.transactions.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Transactions Table */}
      {!summary || summary.transactions.length === 0 ? (
        <Alert severity="info">
          {t('common.noTransactions')} {months[selectedMonth - 1]} {selectedYear}
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>{t('common.date')}</TableCell>
                <TableCell>{t('common.description')}</TableCell>
                <TableCell>{t('common.category')}</TableCell>
                <TableCell align="right">{t('common.amount')}</TableCell>
                <TableCell align="center">{t('common.type')}</TableCell>
                <TableCell align="center">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary.transactions.map(transaction => (
                <TableRow key={transaction.id} hover>
                  <TableCell>{formatTransactionDate(transaction)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell align="right">
                    <Typography sx={{
                      color: transaction.amount > 0 ? '#4caf50' : '#f44336',
                      fontWeight: 'bold'
                    }}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={transaction.amount > 0 ? t('common.income') : t('common.expense')}
                      color={transaction.amount > 0 ? 'success' : 'error'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditTransaction(transaction)}
                        color="primary"
                        sx={{ minWidth: { xs: 0, sm: 'auto' } }}
                      >
                        {t('common.edit')}
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        color="error"
                        sx={{ minWidth: { xs: 0, sm: 'auto' } }}
                      >
                        {t('common.delete')}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                <TableCell colSpan={3}>
                  <Typography sx={{ fontWeight: 'bold' }}>{t('common.totals')}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                    +${monthlyTotals?.income.toFixed(2) || '0.00'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                    -${monthlyTotals?.expenses.toFixed(2) || '0.00'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontWeight: 'bold' }}>{t('common.netBalance')}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{
                    fontWeight: 'bold',
                    color: monthlyNet >= 0 ? '#4caf50' : '#f44336'
                  }}>
                    ${monthlyNet.toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? t('common.editTransaction') : t('common.addTransaction')}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={t('common.date')}
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t('common.description')}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
          />
          <TextField
            label={t('common.amount')}
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            fullWidth
            step="0.01"
            helperText={t('common.amountHelper')}
          />
          <FormControl fullWidth>
            <InputLabel>{t('common.category')}</InputLabel>
            <Select
              value={formData.category}
              label={t('common.category')}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {TRANSACTION_CATEGORIES.map(cat => (
                <MenuItem key={cat} value={cat}>
                  {t(`expenses.categories.${cat.toLowerCase()}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button onClick={handleSaveTransaction} variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

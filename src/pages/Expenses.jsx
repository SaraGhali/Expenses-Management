import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
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
import { useTransactions } from '../hooks/useTransactions'
import { i18n } from '../i18n/i18n'
import { TRANSACTION_CATEGORIES } from '../constants'

export default function Expenses() {
  const navigate = useNavigate()
  const { user, initializing } = useAuthUser()
  const { transactions, loading, error, addTransaction, deleteTransaction, updateTransaction } = useTransactions(user?.uid)
  
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState(null)
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

  if (!user) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          {t('common.pleaseLogin')}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          {t('navigation.login')}
        </Button>
      </Box>
    )
  }

  const handleOpenDialog = (transaction = null) => {
    if (transaction) {
      setEditingId(transaction.id)
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        category: transaction.category,
        date: transaction.date.split('T')[0]
      })
    } else {
      setEditingId(null)
      setFormData({
        description: '',
        amount: '',
        category: 'Other',
        date: new Date().toISOString().split('T')[0]
      })
    }
    setOpenDialog(true)
  }

  const handleSaveTransaction = async () => {
    if (!formData.description || !formData.amount) {
      alert(t('expenses.fillAllFields'))
      return
    }

    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount)
      }

      if (editingId) {
        await updateTransaction(editingId, data)
      } else {
        await addTransaction(data)
      }

      setOpenDialog(false)
    } catch (err) {
      console.error('Error saving transaction:', err)
      alert(err.message || t('common.errorSaving'))
    }
  }

  const handleDeleteTransaction = async (id) => {
    if (window.confirm(t('common.confirmDelete'))) {
      try {
        await deleteTransaction(id)
      } catch (err) {
        console.error('Error deleting transaction:', err)
        alert(err.message || t('common.errorDeleting'))
      }
    }
  }

  const totalIncome = transactions.reduce((sum, transaction) => sum + (transaction.amount > 0 ? transaction.amount : 0), 0)
  const totalExpenses = transactions.reduce((sum, transaction) => sum + (transaction.amount < 0 ? Math.abs(transaction.amount) : 0), 0)
  const currentBalance = totalIncome - totalExpenses

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start', justifyContent: 'space-between', gap: 3, mb: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TrendingUpIcon sx={{ fontSize: 42, color: 'primary.main' }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 800 }}>
              {t('expenses.title')}
            </Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary', maxWidth: 700 }}>
            {t('expenses.descriptionText') || 'Add, edit, and review your incomes and expenses in one place.'}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ alignSelf: 'center' }}
        >
          {t('expenses.addExpense')}
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, mb: 4 }}>
        <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
          <Typography sx={{ color: 'text.secondary', mb: 1 }}>Income</Typography>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>+${totalIncome.toFixed(2)}</Typography>
        </Paper>
        <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
          <Typography sx={{ color: 'text.secondary', mb: 1 }}>Expenses</Typography>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>-${totalExpenses.toFixed(2)}</Typography>
        </Paper>
        <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
          <Typography sx={{ color: 'text.secondary', mb: 1 }}>Balance</Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: currentBalance >= 0 ? 'success.main' : 'error.main' }}>
            ${currentBalance.toFixed(2)}
          </Typography>
        </Paper>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {transactions.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          {t('expenses.noExpenses')}
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto', borderRadius: 3, p: 1, bgcolor: 'rgba(255,255,255,0.05)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <TableCell>{t('expenses.date')}</TableCell>
                <TableCell>{t('expenses.description')}</TableCell>
                <TableCell>{t('expenses.category')}</TableCell>
                <TableCell align="right">{t('expenses.amount')}</TableCell>
                <TableCell align="center">{t('expenses.type')}</TableCell>
                <TableCell align="center">{t('expenses.action')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell align="right">
                    <Typography sx={{
                      color: transaction.amount > 0 ? 'success.main' : 'error.main',
                      fontWeight: 'bold',
                    }}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={transaction.amount > 0 ? t('expenses.income') : t('expenses.expense')}
                      color={transaction.amount > 0 ? 'success' : 'error'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog(transaction)}
                      color="primary"
                    >
                      {t('common.edit')}
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      color="error"
                    >
                      {t('expenses.delete')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? t('common.editTransaction') : t('expenses.addExpense')}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={t('expenses.date')}
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t('expenses.description')}
            fullWidth
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            label={t('expenses.amount')}
            type="number"
            inputProps={{ step: '0.01' }}
            fullWidth
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            helperText={t('common.amountHelper')}
          />
          <FormControl fullWidth>
            <InputLabel>{t('expenses.category')}</InputLabel>
            <Select
              value={formData.category}
              label={t('expenses.category')}
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
          <Button onClick={() => setOpenDialog(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleSaveTransaction} variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

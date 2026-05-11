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
          Please login to manage transactions
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          Go to Login
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
      alert(err.message || 'Error saving transaction')
    }
  }

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id)
      } catch (err) {
        console.error('Error deleting transaction:', err)
        alert(err.message || 'Error deleting transaction')
      }
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            {t('expenses.title')}
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          {t('expenses.addExpense')}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {transactions.length === 0 ? (
        <Alert severity="info">
          {t('expenses.noExpenses')}
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>{t('expenses.date')}</TableCell>
                <TableCell>{t('expenses.description')}</TableCell>
                <TableCell>{t('expenses.category')}</TableCell>
                <TableCell align="right">{t('expenses.amount')}</TableCell>
                <TableCell align="center">Type</TableCell>
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
                      color: transaction.amount > 0 ? '#4caf50' : '#f44336',
                      fontWeight: 'bold'
                    }}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={transaction.amount > 0 ? 'Income' : 'Expense'}
                      color={transaction.amount > 0 ? 'success' : 'error'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ display: 'flex', gap: 0.5 }}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog(transaction)}
                      color="primary"
                    >
                      Edit
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
          {editingId ? 'Edit Transaction' : t('expenses.addExpense')}
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
            helperText="Positive for income, negative for expenses"
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

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
import { useEffect, useState } from 'react'
import { transactionService } from '../utils/firebaseService'
import { i18n } from '../i18n/i18n'

export default function Expenses() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0]
  })

  const t = (key) => i18n.t(key)
  const userId = 'test-user' // Replace with actual auth

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const data = await transactionService.getUserTransactions(userId)
      setTransactions(data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTransaction = async () => {
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
        await transactionService.addTransaction(userId, {
          ...formData,
          amount: parseFloat(formData.amount)
        })
      }

      setFormData({
        description: '',
        amount: '',
        category: 'Other',
        date: new Date().toISOString().split('T')[0]
      })
      setOpenDialog(false)
      fetchTransactions()
    } catch (error) {
      console.error('Error saving transaction:', error)
      alert('Error saving transaction')
    }
  }

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await transactionService.deleteTransaction(id)
        fetchTransactions()
      } catch (error) {
        console.error('Error deleting transaction:', error)
        alert('Error deleting transaction')
      }
    }
  }

  const handleEditTransaction = (transaction) => {
    setEditingId(transaction.id)
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: transaction.date.split('T')[0]
    })
    setOpenDialog(true)
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
          onClick={() => {
            setEditingId(null)
            setFormData({
              description: '',
              amount: '',
              category: 'Other',
              date: new Date().toISOString().split('T')[0]
            })
            setOpenDialog(true)
          }}
        >
          {t('expenses.addExpense')}
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : transactions.length === 0 ? (
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
                  <TableCell align="center">
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditTransaction(transaction)}
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
              <MenuItem value="Food">{t('expenses.categories.food')}</MenuItem>
              <MenuItem value="Transport">{t('expenses.categories.transport')}</MenuItem>
              <MenuItem value="Entertainment">{t('expenses.categories.entertainment')}</MenuItem>
              <MenuItem value="Utilities">{t('expenses.categories.utilities')}</MenuItem>
              <MenuItem value="Health">{t('expenses.categories.health')}</MenuItem>
              <MenuItem value="Education">{t('expenses.categories.education')}</MenuItem>
              <MenuItem value="Shopping">{t('expenses.categories.shopping')}</MenuItem>
              <MenuItem value="Income">{t('expenses.categories.income')}</MenuItem>
              <MenuItem value="Other">{t('expenses.categories.other')}</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleAddTransaction} variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

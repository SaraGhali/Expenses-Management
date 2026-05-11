import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import HistoryIcon from '@mui/icons-material/History'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import { useEffect, useState } from 'react'
import { transactionService } from '../utils/firebaseService'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function Summary() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [editingId, setEditingId] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0]
  })

  // Mock user ID - replace with actual auth
  const userId = 'test-user'

  useEffect(() => {
    fetchMonthlySummary()
  }, [selectedMonth, selectedYear])

  const fetchMonthlySummary = async () => {
    try {
      setLoading(true)
      const data = await transactionService.getMonthlySummary(userId, selectedYear, selectedMonth)
      setSummary(data)
    } catch (error) {
      console.error('Error fetching summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.deleteTransaction(id)
        fetchMonthlySummary()
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

  const handleSaveTransaction = async () => {
    if (!formData.description || !formData.amount) {
      alert('Please fill in all fields')
      return
    }

    try {
      if (editingId) {
        await transactionService.updateTransaction(editingId, {
          ...formData,
          amount: parseFloat(formData.amount)
        })
        setEditingId(null)
      }
      setOpenDialog(false)
      setFormData({
        description: '',
        amount: '',
        category: 'Other',
        date: new Date().toISOString().split('T')[0]
      })
      fetchMonthlySummary()
    } catch (error) {
      console.error('Error saving transaction:', error)
      alert('Error saving transaction')
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

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
        <HistoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h3" component="h1">
          Monthly Summary
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={selectedMonth}
            label="Month"
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month, index) => (
              <MenuItem key={index} value={index + 1}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear}
            label="Year"
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

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Typography color="inherit" gutterBottom>
                Total Income
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                +${summary?.income.toFixed(2) || '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Typography color="inherit" gutterBottom>
                Total Expenses
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                -${summary?.expenses.toFixed(2) || '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: summary?.net >= 0
              ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
              : 'linear-gradient(135deg, #f44336 0%, #da190b 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography color="inherit" gutterBottom>
                Net Balance
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ${summary?.net.toFixed(2) || '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Transactions
              </Typography>
              <Typography variant="h4">
                {summary?.transactions.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transactions Table */}
      {!summary || summary.transactions.length === 0 ? (
        <Alert severity="info">
          No transactions for {months[selectedMonth - 1]} {selectedYear}
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary.transactions.map(transaction => (
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
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Transaction' : 'Add Transaction'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
          />
          <TextField
            label="Amount (use - for expenses)"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            fullWidth
            step="0.01"
            helperText="Positive for income, negative for expenses"
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Transport">Transport</MenuItem>
              <MenuItem value="Entertainment">Entertainment</MenuItem>
              <MenuItem value="Utilities">Utilities</MenuItem>
              <MenuItem value="Health">Health</MenuItem>
              <MenuItem value="Education">Education</MenuItem>
              <MenuItem value="Shopping">Shopping</MenuItem>
              <MenuItem value="Income">Income</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveTransaction} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

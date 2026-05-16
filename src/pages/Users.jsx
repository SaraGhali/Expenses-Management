import {Link} from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { transactionService } from '../utils/firebaseService'
import { i18n } from '../i18n/i18n'
import { formatCurrency } from '../utils/format'

const defaultForm = {
  displayName: '',
  email: '',
  role: 'User',
  balance: '0.00'
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState(defaultForm)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const t = (key) => i18n.t(key)

  const formatTimestamp = (value) => {
    if (!value) return '—'
    if (value instanceof Date) return value.toLocaleString()
    if (typeof value === 'object') {
      if (typeof value.toDate === 'function') return value.toDate().toLocaleString()
      if (typeof value.seconds === 'number') {
        const date = new Date(value.seconds * 1000 + Math.round((value.nanoseconds || 0) / 1e6))
        return date.toLocaleString()
      }
    }
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString()
  }

  const formatBalance = (value) => {
    const amount = Number(value)
    return Number.isFinite(amount) ? formatCurrency(amount, i18n.getLanguage()) : '—'
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const allUsers = await transactionService.getAllUsers()
      setUsers(allUsers)
    } catch (err) {
      setError(err.message || t('users.loadError'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openAddDialog = () => {
    setEditingUser(null)
    setFormData(defaultForm)
    setOpenDialog(true)
  }

  const openEditDialog = (user) => {
    setEditingUser(user)
    setFormData({
      displayName: user.displayName || user.name || '',
      email: user.email || '',
      role: user.role || 'User',
      balance: user.balance != null ? String(user.balance) : '0.00'
    })
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingUser(null)
    setFormData(defaultForm)
  }

  const handleSaveUser = async () => {
    if (!formData.displayName || !formData.email) {
      setSnackbar({ open: true, message: t('users.fillAllFields'), severity: 'warning' })
      return
    }

    const balanceValue = formData.balance === '' ? 0 : parseFloat(formData.balance)
    if (formData.balance !== '' && Number.isNaN(balanceValue)) {
      setSnackbar({ open: true, message: t('users.invalidBalance'), severity: 'warning' })
      return
    }

    const payload = {
      ...formData,
      balance: Number.isFinite(balanceValue) ? Number(balanceValue.toFixed(2)) : 0
    }

    try {
      if (editingUser) {
        await transactionService.updateUser(editingUser.id, payload)
        setSnackbar({ open: true, message: t('users.updateSuccess'), severity: 'success' })
      } else {
        await transactionService.addUser(payload)
        setSnackbar({ open: true, message: t('users.addSuccess'), severity: 'success' })
      }
      handleCloseDialog()
      await fetchUsers()
    } catch (err) {
      setSnackbar({ open: true, message: err.message || t('users.saveError'), severity: 'error' })
    }
  }

  const handleDeleteUser = async (user) => {
    if (!window.confirm(t('users.deleteConfirmation'))) return

    try {
      await transactionService.deleteUser(user.id)
      setSnackbar({ open: true, message: t('users.deleteSuccess'), severity: 'success' })
      await fetchUsers()
    } catch (err) {
      setSnackbar({ open: true, message: err.message || t('users.deleteError'), severity: 'error' })
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 60px rgba(0,0,0,0.16)' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start', justifyContent: 'space-between', gap: 3 }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
              {t('navigation.users')}
            </Typography>
            <Typography sx={{ color: 'text.secondary', maxWidth: 700 }}>
              {t('users.description') || 'Manage the list of registered users and review their roles at a glance.'}
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog}>
            {t('users.addUser')}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography sx={{ opacity: 0.9 }} gutterBottom>
                {t('users.totalUsers')}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {users.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : users.length === 0 ? (
        <Alert severity="info">{t('users.noUsers')}</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto', borderRadius: 3, p: 1, bgcolor: 'rgba(255,255,255,0.05)' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>{t('users.name')}</TableCell>
                <TableCell>{t('users.email')}</TableCell>
                <TableCell>{t('users.balance')}</TableCell>
                <TableCell>{t('common.createdAt')}</TableCell>
                <TableCell align="center">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  {/* Make the name clickable */}
                  <Typography
                    component={Link}
                    to={`/users/${user.id}`}
                    sx={{
                      fontWeight: 600,
                      textDecoration: 'none',
                      color: 'primary.main',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    {user.displayName || user.name || '—'}
                  </Typography>
                </TableCell>
                <TableCell>{user.email || '—'}</TableCell>
                <TableCell>{formatBalance(user.balance)}</TableCell>
                <TableCell>{user.createdAt ? formatTimestamp(user.createdAt) : '—'}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    {/* Optional: Add a dedicated view button */}
                    {/* <IconButton
                      component={Link}
                      to={`/users/${user.id}`}
                      color="primary"
                      size="small"
                    >
                      <Typography variant="caption" sx={{ mr: 1 }}>{t('common.view') || 'View'}</Typography>
                    </IconButton> */}
                    <IconButton size="small" onClick={() => openEditDialog(user)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteUser(user)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingUser ? t('users.editUser') : t('users.addUser')}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <TextField
            label={t('login.displayName')}
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            fullWidth
          />
          <TextField
            label={t('login.email')}
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            fullWidth
          />
          <TextField
            label={t('users.balance')}
            type="number"
            inputProps={{ step: '0.01' }}
            value={formData.balance}
            onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>{t('users.role')}</InputLabel>
            <Select
              value={formData.role}
              label={t('users.role')}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="User">{t('users.roleUser')}</MenuItem>
              <MenuItem value="Admin">{t('users.roleAdmin')}</MenuItem>
              <MenuItem value="Manager">{t('users.roleManager')}</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button onClick={handleSaveUser} variant="contained">
            {editingUser ? t('common.save') : t('users.addUser')}
          </Button>
        </DialogActions>
      </Dialog>

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

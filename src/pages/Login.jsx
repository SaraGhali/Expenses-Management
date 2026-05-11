import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../utils/authService'
import { useAuthUser } from '../hooks/useAuthUser'

export default function Login() {
  const navigate = useNavigate()
  const { user, initializing } = useAuthUser()

  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const canSubmit = useMemo(() => {
    if (!email || !password) return false
    if (mode === 'signup' && !displayName) return false
    return true
  }, [email, password, mode, displayName])

  if (initializing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (user) {
    navigate('/', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'signup') {
        await authService.signup(email, password, displayName)
      } else {
        await authService.login(email, password)
      }
      navigate('/', { replace: true })
    } catch (err) {
      setError(err?.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {mode === 'signup' ? 'Create account' : 'Login'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {mode === 'signup' && (
            <TextField
              label="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          )}
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="contained" disabled={!canSubmit || loading}>
            {loading ? <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} /> : null}
            {mode === 'signup' ? 'Sign up' : 'Sign in'}
          </Button>

          <Button
            variant="text"
            onClick={() => {
              setError(null)
              setMode((m) => (m === 'signup' ? 'login' : 'signup'))
            }}
          >
            {mode === 'signup' ? 'I already have an account' : 'Create an account'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}


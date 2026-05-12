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
import { i18n } from '../i18n/i18n'

export default function Login() {
  const navigate = useNavigate()
  const { user, initializing } = useAuthUser()
  const t = (key) => i18n.t(key)

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
      setError(err?.message || t('login.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {mode === 'signup' ? t('login.title.signup') : t('login.title.login')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {mode === 'signup' && (
            <TextField
              label={t('login.displayName')}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          )}
          <TextField label={t('login.email')} value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField
            label={t('login.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="contained" disabled={!canSubmit || loading}>
            {loading ? <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} /> : null}
            {mode === 'signup' ? t('login.action.signup') : t('login.action.signin')}
          </Button>

          <Button
            variant="text"
            onClick={() => {
              setError(null)
              setMode((m) => (m === 'signup' ? 'login' : 'signup'))
            }}
          >
            {mode === 'signup' ? t('login.switch.toLogin') : t('login.switch.toSignup')}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}


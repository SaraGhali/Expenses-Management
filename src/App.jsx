import React, { useEffect, useState } from 'react'
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import createAppTheme from './theme'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Reports from './pages/Reports'
import Summary from './pages/Summary'
import Login from './pages/Login'
import { i18n } from './i18n/i18n'
import AppHeader from './components/layout/AppHeader'
import AppNavbar from './components/layout/AppNavbar'

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [language, setLanguage] = useState(i18n.getLanguage())
  const [anchorEl, setAnchorEl] = useState(null)
  const [navAnchorEl, setNavAnchorEl] = useState(null)

  const theme = createAppTheme(language)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const t = (key) => i18n.t(key)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    const handleLanguageChange = () => setLanguage(i18n.getLanguage())

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('languageChanged', handleLanguageChange)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('languageChanged', handleLanguageChange)
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            direction: i18n.getDirection(),
          }}
        >
          <AppHeader>
            <AppNavbar
              isOnline={isOnline}
              language={language}
              t={t}
              direction={i18n.getDirection()}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              navAnchorEl={navAnchorEl}
              setNavAnchorEl={setNavAnchorEl}
              isMobile={isMobile}
            />
          </AppHeader>

          <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </Container>

          <Box
            component="footer"
            sx={{
              backgroundColor: '#2d3436',
              color: 'white',
              textAlign: 'center',
              py: 3,
              mt: 'auto',
            }}
          >
            <p>
              &copy; 2024 {t('app.title')}. {t('common.offline')}
            </p>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

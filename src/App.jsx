import HistoryIcon from '@mui/icons-material/History'
import HomeIcon from '@mui/icons-material/Home'
import LanguageIcon from '@mui/icons-material/Language'
import SignalCellularNullIcon from '@mui/icons-material/SignalCellularNull'
import SummarizeIcon from '@mui/icons-material/Summarize'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import {
    AppBar,
    Box,
    Button,
    Chip,
    Container,
    CssBaseline,
    Menu,
    MenuItem,
    ThemeProvider,
    Toolbar,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './App.css'
import createAppTheme from './theme'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Reports from './pages/Reports'
import Summary from './pages/Summary'
import { i18n } from './i18n/i18n'

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [language, setLanguage] = useState(i18n.getLanguage())
  const [anchorEl, setAnchorEl] = useState(null)
  
  const theme = createAppTheme(language)
  const t = (key) => i18n.t(key)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    const handleLanguageChange = () => {
      setLanguage(i18n.getLanguage())
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('languageChanged', handleLanguageChange)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('languageChanged', handleLanguageChange)
    }
  }, [])

  const handleLanguageMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    setLanguage(lang)
    setAnchorEl(null)
  }

  const handleCloseLanguageMenu = () => {
    setAnchorEl(null)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            direction: i18n.getDirection()
          }}
        >
          <AppBar position="static">
            <Toolbar>
              <Box sx={{ flexGrow: 1 }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
                  {t('app.title')}
                </h1>
              </Box>
              
              <Button 
                color="inherit" 
                component={Link} 
                to="/" 
                startIcon={<HomeIcon />}
              >
                {t('navigation.dashboard')}
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/expenses" 
                startIcon={<TrendingUpIcon />}
              >
                {t('navigation.expenses')}
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/summary" 
                startIcon={<SummarizeIcon />}
              >
                {t('navigation.summary')}
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/reports" 
                startIcon={<HistoryIcon />}
              >
                {t('navigation.reports')}
              </Button>

              <Button
                color="inherit"
                startIcon={<LanguageIcon />}
                onClick={handleLanguageMenu}
                sx={{ ml: 1 }}
              >
                {language.toUpperCase()}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseLanguageMenu}
              >
                <MenuItem 
                  onClick={() => handleChangeLanguage('en')}
                  selected={language === 'en'}
                >
                  English
                </MenuItem>
                <MenuItem 
                  onClick={() => handleChangeLanguage('ar')}
                  selected={language === 'ar'}
                >
                  العربية
                </MenuItem>
              </Menu>

              {!isOnline && (
                <Chip
                  icon={<SignalCellularNullIcon />}
                  label={t('common.offline')}
                  color="error"
                  variant="outlined"
                  sx={{ ml: 2, color: 'white', borderColor: 'white' }}
                />
              )}
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
            <Routes>
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
              mt: 'auto'
            }}
          >
            <p>&copy; 2024 {t('app.title')}. {t('common.offline')}</p>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App


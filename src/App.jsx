import React, { useEffect, useState } from 'react'
import {
    Box,
    Container,
    CssBaseline,
    ThemeProvider,
    useMediaQuery,
    Button,
    Typography
} from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import createAppTheme from './theme'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import Summary from './pages/Summary'
import Transactions from './pages/Transactions'
import Users from './pages/Users'
import Login from './pages/Login'
import { i18n } from './i18n/i18n'
import AppHeader from './components/layout/AppHeader'
import AppNavbar from './components/layout/AppNavbar'
import { useAuthUser } from './hooks/useAuthUser'
import UserTransactions from './pages/UserTransactions'

function App() {
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [language, setLanguage] = useState(i18n.getLanguage())
    const [anchorEl, setAnchorEl] = useState(null)
    const [navAnchorEl, setNavAnchorEl] = useState(null)

    const { user } = useAuthUser()
    const theme = createAppTheme(language)
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const t = (key) => i18n.t(key)
    const direction = i18n.getDirection()

    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)
        const handleLanguageChange = (e) => {
            const newLang = e.detail?.language || i18n.getLanguage()
            setLanguage(newLang)
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

    useEffect(() => {
        document.documentElement.dir = direction
        document.documentElement.lang = language
    }, [direction, language])

    const handleChangeLanguage = (lang) => {
        i18n.changeLanguage(lang)
        setLanguage(lang)
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
                        direction: i18n.getDirection(),
                    }}
                >
                    <AppHeader>
                        <AppNavbar
                            user={user}
                            isOnline={isOnline}
                            language={language}
                            t={t}
                            direction={direction}
                            anchorEl={anchorEl}
                            setAnchorEl={setAnchorEl}
                            navAnchorEl={navAnchorEl}
                            setNavAnchorEl={setNavAnchorEl}
                            isMobile={isMobile}
                            onLanguageChange={handleChangeLanguage}
                        />
                    </AppHeader>

                    <Container maxWidth="lg" sx={{ py: 5, flex: 1 }}>


                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/transactions" element={<Transactions />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/summary" element={<Summary />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/users/:userId" element={<UserTransactions />} />
                        </Routes>
                    </Container>

                    <Box
                        component="footer"
                        sx={{
                            background: 'linear-gradient(180deg, rgba(9,18,39,0.95), rgba(9,18,39,0.98))',
                            color: 'rgba(255,255,255,0.74)',
                            textAlign: 'center',
                            py: 3,
                            mt: 'auto',
                            borderTop: '1px solid rgba(255,255,255,0.08)',
                        }}
                    >
                        <Typography variant="body2">
                            © 2024 {t('app.title')}. {t('common.offline')}
                        </Typography>
                    </Box>
                </Box>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App

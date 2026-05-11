import {
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import HomeIcon from '@mui/icons-material/Home'
import LanguageIcon from '@mui/icons-material/Language'
import SignalCellularNullIcon from '@mui/icons-material/SignalCellularNull'
import SummarizeIcon from '@mui/icons-material/Summarize'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Link } from 'react-router-dom'
import { useMemo } from 'react'

const navItems = [
  { to: '/', icon: <HomeIcon fontSize="small" />, labelKey: 'navigation.dashboard', showIconLabeled: true },
  { to: '/expenses', icon: <TrendingUpIcon fontSize="small" />, labelKey: 'navigation.expenses', showIconLabeled: true },
  { to: '/summary', icon: <SummarizeIcon fontSize="small" />, labelKey: 'navigation.summary', showIconLabeled: true },
  { to: '/reports', icon: <HistoryIcon fontSize="small" />, labelKey: 'navigation.reports', showIconLabeled: true },
]

export default function AppNavbar({
  isOnline,
  language,
  t,
  direction,
  anchorEl,
  setAnchorEl,
  navAnchorEl,
  setNavAnchorEl,
  isMobile,
}) {
  const languageMenuOpen = Boolean(anchorEl)
  const navMenuOpen = Boolean(navAnchorEl)

  const handleChangeLanguage = (lang) => {
    // i18n module lives in App.jsx; AppNavbar is just UI.
    // App.jsx owns i18n and passes current language.
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }))
    setAnchorEl(null)
  }

  const currentLang = useMemo(() => language?.toString?.() ?? 'en', [language])

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', direction }}>
        <Box component="header">
          {/* AppBar element is owned by parent for theme gradient; we only render toolbar contents */}
          <Box
            component="nav"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1,
              gap: 1,
              flexWrap: 'wrap',
              direction,
              '& > *': {
                order: direction === 'rtl' ? 'inherit' : 'inherit'
              }
            }}
          >
            {/* Logo - First in LTR, Last in RTL */}
            <Box 
              sx={{ 
                fontSize: '1.5rem', 
                fontWeight: 700,
                order: direction === 'rtl' ? 99 : 1,
                mr: direction === 'rtl' ? 'auto' : 0,
                ml: direction === 'rtl' ? 0 : 0
              }}
            >
              {t('app.title')}
            </Box>

            {/* Navigation items - Middle section */}
            {!isMobile && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  order: 2,
                  mx: 'auto'
                }}
              >
                {navItems.map((item) => (
                  <Button
                    key={item.to}
                    color="inherit"
                    component={Link}
                    to={item.to}
                    startIcon={item.icon}
                    sx={{ 
                      whiteSpace: 'nowrap',
                      fontSize: '0.85rem'
                    }}
                  >
                    {t(item.labelKey)}
                  </Button>
                ))}
              </Box>
            )}

            {/* Mobile menu button */}
            {isMobile && (
              <>
                <IconButton
                  color="inherit"
                  onClick={(e) => setNavAnchorEl(e.currentTarget)}
                  aria-label="open navigation"
                  sx={{ order: 3, ml: 'auto' }}
                >
                  <HistoryIcon />
                </IconButton>

                <Menu
                  anchorEl={navAnchorEl}
                  open={navMenuOpen}
                  onClose={() => setNavAnchorEl(null)}
                >
                  {navItems.map((item) => (
                    <MenuItem
                      key={item.to}
                      component={Link}
                      to={item.to}
                      onClick={() => setNavAnchorEl(null)}
                    >
                      {item.icon}
                      <Box sx={{ ml: 1 }}>{t(item.labelKey)}</Box>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}

            {/* Language button - Right side in LTR, Left in RTL */}
            <Button
              color="inherit"
              startIcon={<LanguageIcon />}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ 
                order: 4,
                whiteSpace: 'nowrap',
                fontSize: '0.9rem'
              }}
            >
              {currentLang.toUpperCase()}
            </Button>

            <Menu 
              anchorEl={anchorEl} 
              open={languageMenuOpen} 
              onClose={() => setAnchorEl(null)}
              transformOrigin={direction === 'rtl' ? { horizontal: 'left', vertical: 'top' } : { horizontal: 'right', vertical: 'top' }}
              anchorOrigin={direction === 'rtl' ? { horizontal: 'left', vertical: 'bottom' } : { horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => handleChangeLanguage('en')} selected={currentLang === 'en'}>
                English
              </MenuItem>
              <MenuItem onClick={() => handleChangeLanguage('ar')} selected={currentLang === 'ar'}>
                العربية
              </MenuItem>
            </Menu>

            {/* Offline chip */}
            {!isOnline && (
              <Chip
                icon={<SignalCellularNullIcon />}
                label={t('common.offline')}
                color="error"
                variant="outlined"
                sx={{ 
                  order: 5,
                  color: 'white', 
                  borderColor: 'white',
                  fontSize: '0.75rem'
                }}
              />
            )}

            {/* Login button */}
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={{ 
                order: 6,
                whiteSpace: 'nowrap',
                fontSize: '0.9rem'
              }}
            >
              {t('navigation.login') || 'Login'}
            </Button>
          </Box>
        </Box>

        {/* parent renders footer + routes; keep navbar UI only */}
        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }} />
      </Box>
    </>
  )
}


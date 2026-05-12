import { Box, Button, Chip, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import HomeIcon from '@mui/icons-material/Home'
import LanguageIcon from '@mui/icons-material/Language'
import ListAltIcon from '@mui/icons-material/ReceiptLong'
import PeopleIcon from '@mui/icons-material/People'
import SignalCellularNullIcon from '@mui/icons-material/SignalCellularNull'
import SummarizeIcon from '@mui/icons-material/Summarize'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Link, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { authService } from '../../utils/authService'

const navItems = [
  { to: '/', icon: <HomeIcon fontSize="small" />, labelKey: 'navigation.dashboard' },
  { to: '/transactions', icon: <ListAltIcon fontSize="small" />, labelKey: 'navigation.transactions' },
  { to: '/users', icon: <PeopleIcon fontSize="small" />, labelKey: 'navigation.users' },
  { to: '/summary', icon: <SummarizeIcon fontSize="small" />, labelKey: 'navigation.summary' },
  { to: '/reports', icon: <HistoryIcon fontSize="small" />, labelKey: 'navigation.reports' },
]

export default function AppNavbar({
  user,
  isOnline,
  language,
  t,
  direction,
  anchorEl,
  setAnchorEl,
  navAnchorEl,
  setNavAnchorEl,
  isMobile,
  onLanguageChange,
}) {
  const languageMenuOpen = Boolean(anchorEl)
  const navMenuOpen = Boolean(navAnchorEl)
  const navigate = useNavigate()

  const currentLang = useMemo(() => language?.toString?.() ?? 'en', [language])

  const handleChangeLanguage = (lang) => {
    onLanguageChange?.(lang)
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <Box
      component="nav"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
        px: 2,
        py: 1,
        width: '100%',
        direction,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <Typography
          component={Link}
          to="/"
          variant="h5"
          sx={{
            fontWeight: 800,
            color: 'white',
            textDecoration: 'none',
            letterSpacing: 0.5,
          }}
        >
          {t('app.title')}
        </Typography>
      </Box>

      {!isMobile ? (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1, justifyContent: 'center' }}>
          {navItems.map((item) => (
            <Button
              key={item.to}
              color="inherit"
              component={Link}
              to={item.to}
              startIcon={item.icon}
              sx={{
                whiteSpace: 'nowrap',
                fontSize: '0.85rem',
                '& .MuiButton-startIcon': {
                  ml: direction === 'rtl' ? 1 : 0,
                  mr: direction === 'rtl' ? 0 : 1,
                },
              }}
            >
              {t(item.labelKey)}
            </Button>
          ))}
        </Stack>
      ) : (
        <IconButton
          color="inherit"
          onClick={(e) => setNavAnchorEl(e.currentTarget)}
          sx={{ ml: 'auto' }}
        >
          <HistoryIcon />
        </IconButton>
      )}

      <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
        <Button
          color="inherit"
          startIcon={<LanguageIcon />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ whiteSpace: 'nowrap', fontSize: '0.9rem' }}
        >
          {currentLang.toUpperCase()}
        </Button>

        {!isOnline && (
          <Chip
            icon={<SignalCellularNullIcon />}
            label={t('common.offline')}
            color="error"
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.18)',
              fontSize: '0.75rem',
            }}
          />
        )}
      </Stack>

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

      <Menu anchorEl={navAnchorEl} open={navMenuOpen} onClose={() => setNavAnchorEl(null)}>
        {navItems.map((item) => (
          <MenuItem
            key={item.to}
            component={Link}
            to={item.to}
            onClick={() => setNavAnchorEl(null)}
            sx={{
              gap: 1,
              '& .MuiSvgIcon-root': {
                ml: direction === 'rtl' ? 1 : 0,
                mr: direction === 'rtl' ? 0 : 1,
              },
            }}
          >
            {item.icon}
            {t(item.labelKey)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}


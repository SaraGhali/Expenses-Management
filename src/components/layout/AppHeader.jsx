import { AppBar, Box, Toolbar } from '@mui/material'

export default function AppHeader({ children }) {
  return (
    <AppBar position="sticky" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 1400 }}>{children}</Box>
      </Toolbar>
    </AppBar>
  )
}


import {
  AppBar,
  Box,
  Toolbar,
} from '@mui/material'

export default function AppHeader({ children }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ width: '100%' }}>{children}</Box>
      </Toolbar>
    </AppBar>
  )
}


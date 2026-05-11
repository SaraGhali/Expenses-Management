import { createTheme } from '@mui/material/styles'

const createAppTheme = (language = 'en') => {
  const isRTL = language === 'ar'

  return createTheme({
    direction: isRTL ? 'rtl' : 'ltr',
    palette: {
      primary: {
        main: '#667eea',
        light: '#8b9bef',
        dark: '#4c5ac7',
      },
      secondary: {
        main: '#764ba2',
        light: '#9b6fb5',
        dark: '#5a3a7a',
      },
      success: {
        main: '#4caf50',
        light: '#81c784',
        dark: '#388e3c',
      },
      warning: {
        main: '#ff9800',
        light: '#ffb74d',
        dark: '#f57c00',
      },
      error: {
        main: '#f44336',
        light: '#ef5350',
        dark: '#d32f2f',
      },
      background: {
        default: '#f5f7fa',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: isRTL 
        ? [
            'Cairo',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'sans-serif',
          ].join(',')
        : [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.25rem',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            padding: '10px 24px',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
            },
          },
          contained: {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
              transform: 'translateY(-4px)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: '#f5f7fa',
            '& .MuiTableCell-head': {
              fontWeight: 700,
              color: '#333',
              backgroundColor: '#f5f7fa',
              borderBottom: '2px solid #e0e0e0',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: '#667eea',
              },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: '12px',
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
  })
}

export default createAppTheme

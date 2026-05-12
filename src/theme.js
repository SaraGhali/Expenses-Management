import { createTheme } from '@mui/material/styles'

const createAppTheme = (language = 'en') => {
  const isRTL = language === 'ar'

  return createTheme({
    direction: isRTL ? 'rtl' : 'ltr',
    palette: {
      mode: 'dark',
      primary: {
        main: '#667eea',
        light: '#8b9bef',
        dark: '#4c5ac7',
      },
      secondary: {
        main: '#8b5cf6',
        light: '#a07bff',
        dark: '#6d3ddf',
      },
      success: {
        main: '#4caf50',
        light: '#81c784',
        dark: '#388e3c',
      },
      warning: {
        main: '#fb8c00',
        light: '#ffb347',
        dark: '#c56d00',
      },
      error: {
        main: '#ef5350',
        light: '#ff867c',
        dark: '#c62828',
      },
      background: {
        default: '#0a1223',
        paper: 'rgba(12, 20, 44, 0.88)',
      },
      text: {
        primary: '#eef2ff',
        secondary: '#a3b3d3',
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
        fontWeight: 800,
        fontSize: '2.75rem',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2.25rem',
      },
      h3: {
        fontWeight: 700,
        fontSize: '1.75rem',
      },
      h4: {
        fontWeight: 700,
        fontSize: '1.35rem',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7,
      },
      body2: {
        fontSize: '0.95rem',
        lineHeight: 1.6,
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: 'radial-gradient(circle at top left, rgba(102,126,234,0.18), transparent 24%), radial-gradient(circle at bottom right, rgba(139,92,246,0.14), transparent 28%)',
            backgroundColor: '#0a1223',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 999,
            fontWeight: 700,
            padding: '12px 26px',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
            },
          },
          containedPrimary: {
            backgroundColor: '#667eea',
            color: '#fff',
          },
          outlined: {
            borderColor: 'rgba(255,255,255,0.18)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 55px rgba(0,0,0,0.18)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: 'rgba(9, 19, 42, 0.92)',
            border: '1px solid rgba(255,255,255,0.08)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: 'rgba(6, 15, 34, 0.92)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(16px)',
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: 72,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              color: '#d5e0ff',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 16,
              '& fieldset': {
                borderColor: 'rgba(255,255,255,0.14)',
              },
              '&:hover fieldset': {
                borderColor: '#667eea',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#667eea',
                boxShadow: '0 0 0 4px rgba(102,126,234,0.12)',
              },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 24,
            background: '#08122e',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: '#1b2a56',
          },
        },
      },
    },
  })
}

export default createAppTheme

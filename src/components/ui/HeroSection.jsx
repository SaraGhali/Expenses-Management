import { Box, Button } from '@mui/material'
import { i18n } from '../../i18n/i18n'

export default function HeroSection() {
  const t = (key) => i18n.t(key)
  return ( 
 <Box
              sx={{
                mb: 4,
                borderRadius: 4,
                p: 4,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.03)',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start', justifyContent: 'space-between', gap: 3 }}>
                <Box>
                  <Box component="span" sx={{ display: 'block', color: 'primary.light', fontWeight: 700, mb: 1 }}>
                    Welcome to {t('app.title')}
                  </Box>
                  <Box component="h1" sx={{ m: 0, fontSize: '2rem', lineHeight: 1.1, fontWeight: 800 }}>
                    {t('app.subtitle') || 'Smart expense tracking for every user.'}
                  </Box>
                </Box>
                <Button variant="contained" color="primary" href="/transactions" sx={{ alignSelf: 'center', mt: { xs: 2, md: 0 } }}>
                  {t('navigation.transactions')}
                </Button>
              </Box>
            </Box>
    )
}
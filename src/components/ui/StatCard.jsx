import { Box, Card, CardContent, CircularProgress, Typography } from '@mui/material'


export default function StatCard({ title, value, icon: Icon, gradient, loading }) {
  return (
    <Card sx={{
      background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
      color: 'white',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
    }
  }}>
    
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Icon sx={{ fontSize: 40, opacity: 0.9 }} />
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ opacity: 0.9 }} gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {loading ? <CircularProgress size={20} color="inherit" /> : value}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
)
}

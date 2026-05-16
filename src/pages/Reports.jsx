import HistoryIcon from '@mui/icons-material/History'
import { Alert, Box, Card, CardContent, CircularProgress, Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from 'recharts'
import { useAuthUser } from '../hooks/useAuthUser'
import { useYearlyStats } from '../hooks/useYearlyStats'
import { i18n } from '../i18n/i18n'
import { formatCurrency } from '../utils/format'

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#ff9800', '#4caf50', '#00bcd4', '#9c27b0']

export default function Reports() {
  const { user, initializing } = useAuthUser()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const { stats, loading, error } = useYearlyStats(user?.uid, selectedYear)

  const t = (key) => i18n.t(key)

  if (initializing || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }



  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    )
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <HistoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            {t('navigation.reports')}
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>{t('common.year')}</InputLabel>
          <Select
            value={selectedYear}
            label={t('common.year')}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {!stats || !stats.monthlyData || stats.monthlyData.length === 0 ? (
        <Alert severity="info">
          {t('common.noData')} {selectedYear}
        </Alert>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                <CardContent>
                  <Typography sx={{ opacity: 0.9 }} gutterBottom>
                    {t('dashboard.totalIncome')}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(stats.income, i18n.getLanguage(), true)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white'
              }}>
                <CardContent>
                  <Typography sx={{ opacity: 0.9 }} gutterBottom>
                    {t('dashboard.totalExpenses')}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(stats.expenses, i18n.getLanguage(), false)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {t('common.transactionCount')}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {stats.transactionCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {t('common.categories')}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {stats.categories.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Monthly Trend */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                {t('reports.monthlyTrend')}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#4caf50" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#f44336" strokeWidth={2} />
                  <Line type="monotone" dataKey="net" stroke="#667eea" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Breakdown - Bar Chart */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                {t('reports.categoryBreakdown')}
              </Typography>
              {stats.categories.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.categories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="expenses" fill="#f44336" />
                    <Bar dataKey="income" fill="#4caf50" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Alert severity="info">{t('common.noCategoryData')}</Alert>
              )}
            </CardContent>
          </Card>

          {/* Category Details Table */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                {t('reports.categoryDetails')}
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                {stats.categories.map((category, index) => (
                  <Box key={index} sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 1.5,
                    px: 2,
                    borderBottom: '1px solid #eee',
                    backgroundColor: index % 2 === 0 ? '#fafafa' : 'white'
                  }}>
                    <Typography sx={{ fontWeight: 500 }}>{category.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Typography sx={{ color: '#4caf50' }}>
                        {formatCurrency(category.income, i18n.getLanguage(), true)}
                      </Typography>
                      <Typography sx={{ color: '#f44336' }}>
                        {formatCurrency(category.expenses, i18n.getLanguage(), false)}
                      </Typography>
                      <Typography sx={{ fontWeight: 'bold', minWidth: '120px', textAlign: 'right' }}>
                        {formatCurrency(category.income - category.expenses, i18n.getLanguage())}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  )
}

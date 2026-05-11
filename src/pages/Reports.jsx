import HistoryIcon from '@mui/icons-material/History'
import { Alert, Box, Card, CardContent, CircularProgress, Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { transactionService } from '../utils/firebaseService'
import { i18n } from '../i18n/i18n'

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#ff9800', '#4caf50', '#00bcd4', '#9c27b0']

export default function Reports() {
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const t = (key) => i18n.t(key)
  const userId = 'test-user' // Replace with actual auth

  useEffect(() => {
    fetchReportData()
  }, [selectedYear])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const yearSummary = await transactionService.getYearlySummary(userId, selectedYear)
      
      // Prepare data for charts
      const monthlyData = Object.entries(yearSummary.monthlyData).map(([month, data]) => ({
        month: month.split(' ')[0],
        income: data.income,
        expenses: data.expenses,
        net: data.net
      }))

      // Category breakdown
      const categoryData = {}
      yearSummary.transactions.forEach(trans => {
        if (!categoryData[trans.category]) {
          categoryData[trans.category] = { name: trans.category, expenses: 0, income: 0 }
        }
        if (trans.amount > 0) {
          categoryData[trans.category].income += trans.amount
        } else {
          categoryData[trans.category].expenses += Math.abs(trans.amount)
        }
      })

      const categories = Object.values(categoryData)

      setReportData({
        monthlyData,
        categories,
        yearSummary
      })
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
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
            {t('reports.title')}
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear}
            label="Year"
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

      {!reportData || !reportData.monthlyData || reportData.monthlyData.length === 0 ? (
        <Alert severity="info">
          No data available for {selectedYear}
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
                    Total Income
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    +${reportData.yearSummary.transactions
                      .filter(t => t.amount > 0)
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toFixed(2)}
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
                    Total Expenses
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    -${reportData.yearSummary.transactions
                      .filter(t => t.amount < 0)
                      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                      .toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Transactions Count
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {reportData.yearSummary.transactions.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Categories
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {reportData.categories.length}
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
                <LineChart data={reportData.monthlyData}>
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
                {t('reports.categoryBreakdown')} - {t('dashboard.expense')}
              </Typography>
              {reportData.categories.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.categories}>
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
                <Alert severity="info">No category data available</Alert>
              )}
            </CardContent>
          </Card>

          {/* Category Details Table */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Category Details
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                {reportData.categories.map((category, index) => (
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
                        +${category.income.toFixed(2)}
                      </Typography>
                      <Typography sx={{ color: '#f44336' }}>
                        -${category.expenses.toFixed(2)}
                      </Typography>
                      <Typography sx={{ fontWeight: 'bold', minWidth: '100px', textAlign: 'right' }}>
                        ${(category.income - category.expenses).toFixed(2)}
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

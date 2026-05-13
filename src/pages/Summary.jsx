import { useState, useCallback } from 'react'
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, Button } from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'

import { useAuthUser } from '../hooks/useAuthUser'
import { useMonthlySummary } from '../hooks/useMonthlySummary'
import { i18n } from '../i18n/i18n'
import { transactionService } from '../utils/firebaseService'

// Reusable Components
import { TransactionSummary } from '../components/transactions/TransactionSummary'
import { TransactionTable } from '../components/transactions/TransactionTable'
// import { TransactionDialog } from '../components/transactions/TransactionDialog'

const months = Array.from({ length: 12 }, (_, i) =>
  new Date(0, i).toLocaleString(i18n.getLanguage(),{ month: 'long' })
)
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

export default function Summary() {
  const t = useCallback((key) => i18n.t(key), [])
  const { user } = useAuthUser()
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  
  // Now extracting usersMap from our updated hook
  const { summary, usersMap, loading, error, refreshSummary } = useMonthlySummary(selectedYear, selectedMonth)


  const handleDelete = async (id) => {
    if (!window.confirm(t('common.confirmDelete'))) return
    try {
      await transactionService.deleteTransaction(id)
      await refreshSummary()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>

  return (
    <Box>
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <HistoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" fontWeight={800}>{t('navigation.summary')}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, minWidth: 300 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('common.month')}</InputLabel>
              <Select value={selectedMonth} label={t('common.month')} onChange={(e) => setSelectedMonth(e.target.value)}>
                {months.map((m, i) => <MenuItem key={i} value={i + 1}>{m}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>{t('common.year')}</InputLabel>
              <Select value={selectedYear} label={t('common.year')} onChange={(e) => setSelectedYear(e.target.value)}>
                {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {summary && (
        <>
          <TransactionSummary totals={summary} t={t} />
          

          <TransactionTable 
            transactions={summary.transactions} 
            usersMap={usersMap} // Passing the mapped user names here
            onDelete={handleDelete} 
            t={t} 
          />
        </>
      )}

      {/* <TransactionDialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        onSave={handleSave} 
        t={t} 
      /> */}
    </Box>
  )
}
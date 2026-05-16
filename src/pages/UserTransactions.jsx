import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Button, CircularProgress, Paper, 
    FormControl, InputLabel, Select, MenuItem, Stack 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { transactionService } from '../utils/firebaseService';
import { TransactionTable } from '../components/transactions/TransactionTable.jsx';
import { i18n } from '../i18n/i18n';
import { useUserMonthlySummary } from '../hooks/useUserMonthlySummary.js';
import { TransactionSummary } from '../components/transactions/TransactionSummary.jsx';
export default function UserTransactions() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const t = (key) => i18n.t(key);

    // Filter States: Defaults to current month and year
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    const [transactions, setTransactions] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const { userSummary, loading: userLoading, error: userError, refreshUserSummary } = useUserMonthlySummary(year, month, userId);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const allUsers = await transactionService.getAllUsers();
            const user = allUsers.find(u => u.id === userId);
            setUserData(user);

            // Fetch filtered data based on selected month/year
            const summary = await transactionService.getMonthlySummary(userId, year, month);
            setTransactions(summary.transactions);
        } catch (err) {
            console.error("Error loading user data:", err);
        } finally {
            setLoading(false);
        }
    }, [userId, year, month]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    const handleDelete = async (id) => {
        if (window.confirm(t('common.confirmDelete'))) {
            try {
                await transactionService.deleteTransaction(id);
                loadData(); 
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading && !transactions.length) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ p: 4 }}>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/users')} 
                sx={{ mb: 3 }}
            >
                {t('common.backToUsers') || 'Back to Users'}
            </Button>

            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                    <Box>
                        <Typography variant="h3" fontWeight={800}>
                            {userData?.displayName || userData?.name || '—'}
                        </Typography>
                        <Typography variant="h6" color="success.main">
                            {t('users.balance')}: {userData?.balance?.toLocaleString() || '0.00'}
                        </Typography>
                        

                    </Box>

                    {/* Filter Section */}
                    <Stack direction="row" spacing={2}>
                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <InputLabel>{t('common.year') || 'Year'}</InputLabel>
                            <Select value={year} label={t('common.year')} onChange={(e) => setYear(e.target.value)}>
                                {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>{t('common.month') || 'Month'}</InputLabel>
                            <Select value={month} label={t('common.month')} onChange={(e) => setMonth(e.target.value)}>
                                {months.map(m => (
                                    <MenuItem key={m} value={m}>
                                        {/* Automatically translates month names based on active language */}
                                        {new Date(0, m - 1).toLocaleString(i18n.getLanguage(), { month: 'long' })}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Stack>
            </Paper>
            <TransactionSummary totals={userSummary} t={t} />

            <TransactionTable 
                transactions={transactions} 
                usersMap={{ [userId]: userData }}
                onDelete={handleDelete}
                t={t} 
                userCol={false} // Hide user column since we're already in a specific user's view
            />
        </Box>
    );
}
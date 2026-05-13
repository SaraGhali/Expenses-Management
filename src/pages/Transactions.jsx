import React, { useState, useCallback, useMemo } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { useTransactions } from '../hooks/useTransactions';
import { transactionService } from '../utils/firebaseService.js';
import { TransactionSummary } from '../components/transactions/TransactionSummary.jsx';
import { TransactionTable } from '../components/transactions/TransactionTable.jsx';
import { TransactionDialog } from '../components/transactions/TransactionDialog.jsx';
import { i18n } from '../i18n/i18n';

export default function Transactions() {
    const t = useCallback((key) => i18n.t(key), []);
    const { transactions, usersMap, totals, loading, error, refresh } = useTransactions();
    const [openDialog, setOpenDialog] = useState(false);

    // Convert usersMap to array for the selection dropdown
    const usersList = useMemo(() => 
        Object.entries(usersMap).map(([id, data]) => ({ id, ...data })), 
    [usersMap]);

    const handleSave = async (data) => {
        try {
            await transactionService.addTransaction(data.userId, data);
            setOpenDialog(false);
            refresh(); 
        } catch (err) {
            alert(t('common.errorSaving') + ": " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('common.confirmDelete'))) {
            try {
                await transactionService.deleteTransaction(id);
                refresh();
            } catch (err) {
                alert(t('common.errorDeleting') + ": " + err.message);
            }
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" fontWeight={700}>{t('navigation.transactions')}</Typography>
                <Button variant="contained" onClick={() => setOpenDialog(true)}>
                    {t('common.addTransaction')}
                </Button>
            </Box>

            <TransactionSummary totals={totals} t={t} />
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <TransactionTable 
                transactions={transactions} 
                usersMap={usersMap} 
                onDelete={handleDelete}
                t={t} 
            />

            <TransactionDialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)} 
                onSave={handleSave} 
                users={usersList}
                t={t} 
            />
        </Box>
    );
}
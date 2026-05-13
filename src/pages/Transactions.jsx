import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { useAuthUser } from '../hooks/useAuthUser';
import { useTransactions } from '../hooks/useTransactions';
import { transactionService } from '../utils/firebaseService';
import { i18n } from '../i18n/i18n';

// Import sub-components from separate files
import { TransactionSummary } from '../components/transactions/TransactionSummary';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionDialog } from '../components/transactions/TransactionDialog';

export default function Transactions() {
    const { user } = useAuthUser();
    // Memoize t so it doesn't change every render
    const t = useCallback((key) => i18n.t(key), []);

    // 1. Pass only the string uid
    const { transactions, usersMap, totals, loading, error, refresh } = useTransactions(user?.uid);

    const [openDialog, setOpenDialog] = useState(false);

    // 2. Memoize handlers to prevent child re-renders
    const handleOpen = useCallback(() => setOpenDialog(true), []);
    const handleClose = useCallback(() => setOpenDialog(false), []);

    const handleSave = useCallback(async (data) => {
        try {
            if (!user) {
                alert(t('common.notAuthenticated'));
                return;
            }
            
            // Save transaction to Firebase
            await transactionService.addTransaction(user.uid, data);
            
            setOpenDialog(false);
            await refresh(); // Refresh the list after save
        } catch (err) {
            console.error(t('common.errorSaving'), err);
            alert(t('common.errorSaving') + err.message);
        }
    }, [user, refresh]);

    const handleDelete = useCallback(async (id) => {
        if (window.confirm(t('common.confirmDelete'))) {
            try {
                await transactionService.deleteTransaction(id);
                await refresh();
            } catch (err) {
                console.error(t('common.errorDeleting'), err);
                alert(t('common.errorDeleting') + err.message);
            }
        }
    }, [refresh]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h3" fontWeight={800}>{t('navigation.transactions')}</Typography>
                <Button variant="contained" onClick={handleOpen}>{t('common.addTransaction')}</Button>
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
                onClose={handleClose} 
                onSave={handleSave} 
                t={t} 
            />
        </Box>
    );
}
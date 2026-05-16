import React, { useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const TransactionTable = React.memo(({ transactions, usersMap, onDelete, t ,userCol=true}) => {

    /**
     * OPTIMIZATION: Memoized name lookup. 
     * Uses the userId from the transaction to find the name in our usersMap.
     */
    const getUserInfo = useCallback((userId) => {
        const userData = usersMap[userId];
        return {
            name: userData?.name || userData?.displayName || '—',
            balance: userData?.balance ?? 0
        };
    }, [usersMap]);

    /**
     * Safely formats dates whether they are Firestore Timestamps or Strings
     */
    const formatDate = (dateValue) => {
        if (!dateValue) return '—';
        const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
        return isNaN(date.getTime()) ? '—' : date.toLocaleString();
    };

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {userCol && <TableCell sx={{ fontWeight: 'bold' }}>{t('common.user')}</TableCell>}
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('common.description')}</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('common.amount')}</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('common.date')}</TableCell>
                        {/* <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('common.balance') || 'Balance'}</TableCell> */}
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('common.actions')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((item) => {
                        const userInfo = getUserInfo(item.userId);
                        const isPositive = item.amount > 0;

                        return (
                            <TableRow key={item.id} hover>
                                {/* User Name */}
                                {userCol && (
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>
                                            {userInfo.name}
                                        </Typography>
                                    </TableCell>
                                )}

                                {/* Description/Note */}
                                <TableCell align="center">
                                    {item.description || item.note || '—'}
                                </TableCell>

                                {/* Amount (Green for Income, Red for Expense) */}
                                <TableCell align="center">
                                    <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        sx={{ color: isPositive ? 'success.main' : 'error.main' }}
                                    >
                                        {isPositive ? `+${item.amount}` : item.amount}
                                    </Typography>
                                </TableCell>

                                {/* Date */}
                                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                    {formatDate(item.createdAt)}
                                </TableCell>

                                {/* NEW: User's Current Balance
                                <TableCell align="center">
                                    <Typography variant="body2" color="text.secondary" fontWeight={800}>
                                        {userInfo.balance.toLocaleString()}
                                    </Typography>
                                </TableCell> */}

                                {/* Actions */}
                                <TableCell align="center">
                                    <IconButton
                                        onClick={() => onDelete(item.id)}
                                        color="error"
                                        size="small"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            {transactions.length === 0 && (
                <Typography align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No transactions found.
                </Typography>
            )}
        </TableContainer>
    );
});
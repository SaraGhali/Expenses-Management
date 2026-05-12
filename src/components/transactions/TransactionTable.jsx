import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const TransactionTable = React.memo(({ transactions, usersMap, onDelete, t }) => {
    const getUserName = (item) => {
        if (item.userName) return item.userName;
        const mappedUser = usersMap[item.userId];
        return mappedUser?.displayName || mappedUser?.name || item.userId || '—';
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{t('common.user')}</TableCell>
                        {/* <TableCell>{t('common.date')}</TableCell> */}
                        <TableCell align="right">{t('common.amount')}</TableCell>
                        <TableCell align="center">{t('common.actions')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{getUserName(item)}</TableCell>
                            {/* <TableCell>{item.createdAt? item.createdAt : '--'}</TableCell> */}
                            <TableCell align="right" sx={{ color: item.amount > 0 ? 'green' : 'red' }}>
                                {item.amount}
                            </TableCell>
                            <TableCell align="center">
                                <IconButton onClick={() => onDelete(item.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
});
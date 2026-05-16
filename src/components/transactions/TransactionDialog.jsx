import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Button, MenuItem, FormControl, InputLabel, Select 
} from '@mui/material';

export const TransactionDialog = ({ open, onClose, onSave, users, t }) => {
    const [formData, setFormData] = useState({
        userId: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (open) {
            setFormData({
                userId: '',
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0]
            });
        }
    }, [open]);

    const isValid = formData.userId && formData.amount && formData.description;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>{t('common.addTransaction')}</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                
                <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel>{t('common.user') || 'Select User'}</InputLabel>
                    <Select
                        value={formData.userId}
                        label={t('common.user') || 'Select User'}
                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    >
                        {users.map((u) => (
                            <MenuItem key={u.id} value={u.id}>
                                {u.name || u.email || u.id}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label={t('common.description')}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

                <TextField
                    label={t('common.amount')}
                    type="number"
                    helperText="Negative for Expense, Positive for Income"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />

                <TextField
                    type="date"
                    label={t('common.date')}
                    value={formData.createdAt}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>{t('common.cancel')}</Button>
                <Button 
                    onClick={() => onSave(formData)} 
                    variant="contained" 
                    disabled={!isValid}
                >
                    {t('common.save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
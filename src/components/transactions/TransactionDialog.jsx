import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { useState } from 'react';

export const TransactionDialog = ({ open, onClose, onSave, t }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = () => {
    onSave({ ...formData, amount: parseFloat(formData.amount) });
    setFormData({ description: '', amount: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('common.addTransaction')}</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
        <TextField
          label={t('common.description')}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          fullWidth
        />
        <TextField
          label={t('common.amount')}
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          fullWidth
        />
        <TextField
          type="date"
          label={t('common.date')}
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained">{t('common.save')}</Button>
      </DialogActions>
    </Dialog>
  );
};
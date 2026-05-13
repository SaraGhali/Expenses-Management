import { Grid, Card, CardContent, Typography } from '@mui/material';

export const TransactionSummary = ({ totals, t }) => {
  const net = totals.income - totals.expenses;

  const summaryItems = [
    { title: t('dashboard.totalIncome'), value: totals.income, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { title: t('dashboard.totalExpenses'), value: totals.expenses, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { title: t('common.netBalance'), value: net, color: net >= 0 ? 'success.main' : 'error.main' }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {summaryItems.map((item, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Card sx={{ background: item.color, color: 'white' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" gutterBottom>{item.title}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {item?.value?.toFixed(2)|| '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
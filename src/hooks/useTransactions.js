import { useCallback, useEffect, useState, useMemo } from 'react';
import { transactionService } from '../utils/firebaseService';

export function useTransactions(userId) {
    const [transactions, setTransactions] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // Fetch ALL transactions regardless of userId
            const [data, users] = await Promise.all([
                transactionService.getAllTransactions(),
                transactionService.getAllUsers()
            ]);

            setTransactions(data || []);
            
            const map = {};
            users?.forEach(u => { map[u.id] = u; });
            setUsersMap(map);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies - fetch all transactions always

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const totals = useMemo(() => {
        return transactions.reduce((acc, curr) => {
            const amt = Number(curr.amount) || 0;
            amt > 0 ? (acc.income += amt) : (acc.expenses += Math.abs(amt));
            return acc;
        }, { income: 0, expenses: 0 });
    }, [transactions]);

    return { transactions, usersMap, totals, loading, error, refresh: fetchData };
}
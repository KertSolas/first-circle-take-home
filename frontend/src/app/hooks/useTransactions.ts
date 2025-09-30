'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setMessage('Failed to fetch transactions');
    }
  };

  // Add new transaction
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Transaction saved successfully!');
        fetchTransactions();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Failed to save transaction');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return { transactions, loading, message, addTransaction, setMessage };
}

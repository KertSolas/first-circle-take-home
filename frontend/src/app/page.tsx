'use client';
import { useState, useEffect } from 'react';
import TransactionForm from '@/components/TransactionForm';
import TransactionTable from '@/components/TransactionTable';
import { useTransactions } from '@/hooks/useTransactions';
import { Transaction } from '@/types/Transaction';

export default function TransactionPage() {
  const { transactions, loading, message, addTransaction, setMessage } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    await addTransaction(transaction);
  };

  // Show alert when message changes
  useEffect(() => {
    if (message && !loading) {
      alert(message);
      setMessage('');
    }
  }, [message, loading, setMessage]);

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Transaction Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
          >
            + Add Transaction
          </button>
        </div>

        <TransactionTable transactions={transactions} />

        <TransactionForm
          onSubmit={handleAddTransaction}
          loading={loading}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
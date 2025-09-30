'use client';

import { useState } from 'react';
import { Transaction } from '../types';

interface Props {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  loading: boolean;
  message: string;
  setMessage: (msg: string) => void;
}

export default function TransactionForm({ onSubmit, loading, message, setMessage }: Props) {
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    transactionDate: '',
    accountNumber: '',
    accountHolderName: '',
    amount: '',
    status: 'Pending',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ transactionDate: '', accountNumber: '', accountHolderName: '', amount: '', status: 'Pending' });
  };

  return (
    <div className="bg-black shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="date" name="transactionDate" value={formData.transactionDate} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md"/>
          <input type="text" name="accountNumber" placeholder="Account Number"  value={formData.accountNumber} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md"/>
          <input type="text" name="accountHolderName" placeholder="Name" value={formData.accountHolderName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md"/>
          <input type="number" step="0.01" name="amount" placeholder="Payment Amount" value={formData.amount} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md"/>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
            <option value="Pending">Pending</option>
            <option value="Settled">Settled</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md">
          {loading ? 'Saving...' : 'Save Transaction'}
        </button>
      </form>

      {message && (
        <div className={`relative mt-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <button
            type="button"
            aria-label="Close message"
            className="absolute top-1 right-1 text-lg font-bold hover:text-gray-900"
            onClick={() => setMessage('')}
          >
            ×
          </button>
          <div className="pr-6">{message}</div>
        </div>
      )}
    </div>
  );
}

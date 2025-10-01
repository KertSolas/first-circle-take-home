'use client';
import { useState } from 'react';
import { Transaction } from '@/types/Transaction';

interface Props {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionForm({ onSubmit, loading, isOpen, onClose }: Props) {
  const statuses = ['Pending', 'Settled', 'Failed'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    transactionDate: '',
    accountNumber: '',
    accountHolderName: '',
    amount: '',
    status: randomStatus,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ transactionDate: '', accountNumber: '', accountHolderName: '', amount: '', status: randomStatus });
    onClose();
  };

  const handleClose = () => {
    setFormData({ transactionDate: '', accountNumber: '', accountHolderName: '', amount: '', status: randomStatus });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white text-black rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-semibold">Add New Transaction</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Transaction Date</label>
                <input 
                  type="date" 
                  name="transactionDate" 
                  value={formData.transactionDate} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Account Number</label>
                <input 
                  type="text" 
                  name="accountNumber" 
                  placeholder="Account Number" 
                  value={formData.accountNumber} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Account Holder Name</label>
                <input 
                  type="text" 
                  name="accountHolderName" 
                  placeholder="Name" 
                  value={formData.accountHolderName} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Payment Amount</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="amount" 
                  placeholder="Payment Amount" 
                  value={formData.amount} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Transaction'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
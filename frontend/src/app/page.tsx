'use client';

import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import { useTransactions } from './hooks/useTransactions';

export default function TransactionPage() {
  const { transactions, loading, message, addTransaction, setMessage } = useTransactions();

  return (
    <div className="bg-black container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Transaction Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-1">
          <TransactionForm
            onSubmit={addTransaction}
            loading={loading}
            message={message}
            setMessage={setMessage}
          />
        </div>

        {/* Right: Table */}
        <div className="lg:col-span-2">
          <TransactionTable transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

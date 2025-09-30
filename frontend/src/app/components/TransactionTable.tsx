import { Transaction } from '../types';
import StatusBadge from './StatusBadge';

interface Props {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <p className="text-gray-500">No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-black shadow-md rounded-lg p-6 h-[600px] flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

      {/* Scrollable wrapper */}
      <div className="flex-1 overflow-scroll">
        <table className="w-full min-w-[600px]">
          <thead className="bg-black top-0">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Account Number</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Account Holder</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Amount</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map((t, i) => (
              <tr key={i} className="hover:bg-gray-500">
                <td className="px-4 py-3 text-sm">{t.transactionDate}</td>
                <td className="px-4 py-3 text-sm">{t.accountNumber}</td>
                <td className="px-4 py-3 text-sm">{t.accountHolderName}</td>
                <td className="px-4 py-3 text-sm">₱ {parseFloat(t.amount).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm"><StatusBadge status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

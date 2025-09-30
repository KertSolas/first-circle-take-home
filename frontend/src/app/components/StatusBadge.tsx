interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const colors: Record<string, string> = {
    Settled: 'bg-green-500 text-green-800',
    Pending: 'bg-yellow-500 text-yellow-800',
    Failed: 'bg-red-500 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || 'bg-gray-200 text-gray-700'}`}>
      {status}
    </span>
  );
}

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const normalized = status.toLowerCase();
  const color = ['confirmed', 'approved', 'active', 'resolved', 'verified', 'completed'].includes(normalized)
    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
    : ['pending', 'open'].includes(normalized) ? 'border-amber-200 bg-amber-50 text-amber-800'
    : ['rejected', 'declined', 'cancelled', 'canceled'].includes(normalized) ? 'border-red-200 bg-red-50 text-red-800'
    : 'border-gray-200 bg-gray-50 text-gray-600';
  return <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium capitalize ${color}`}>{label || status}</span>;
}

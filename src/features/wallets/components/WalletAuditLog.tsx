import { Receipt } from 'lucide-react';
import { EmptyState } from '@/ui';

export default function WalletAuditLog({ walletId }: { walletId: string }) {
  // Records arrive in v1.3.0.0. For now, empty state only.
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Audit log</h2>
        <p className="text-xs text-mute">Records for {walletId.slice(0, 8)}…</p>
      </div>
      <EmptyState
        icon={<Receipt size={22} strokeWidth={1.75} />}
        title="No records yet"
        description="Records added in Records (v1.3) will appear here with date, class, amount, and notes."
      />
    </div>
  );
}
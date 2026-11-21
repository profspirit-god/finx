import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Receipt } from 'lucide-react';
import { EmptyState, Skeleton } from '@/ui';
import { listRecordsByWallet } from '@/features/records/api/records.repo';
import type { Record } from '@/types/record';
import { RECORD_CLASS_LABELS } from '@/types/record';
import { formatMinor } from '@/lib/format/currency';
import { formatDate } from '@/lib/format/date';
import type { Wallet } from '@/types/wallet';

export default function WalletAuditLog({ wallet }: { wallet: Wallet }) {
  const [records, setRecords] = useState<Record[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const rows = await listRecordsByWallet(wallet.id);
      if (!cancelled) setRecords(rows);
    })();
    return () => {
      cancelled = true;
    };
  }, [wallet.id]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Audit log</h2>
        {records && records.length > 0 && (
          <p className="text-xs text-mute">{records.length} {records.length === 1 ? 'record' : 'records'}</p>
        )}
      </div>

      {records === null && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass p-3 flex items-center gap-3">
              <Skeleton width={36} height={36} rounded="lg" />
              <div className="flex-1 space-y-2">
                <Skeleton width="50%" height={12} />
                <Skeleton width="30%" height={10} />
              </div>
              <Skeleton width={70} height={16} />
            </div>
          ))}
        </div>
      )}

      {records !== null && records.length === 0 && (
        <EmptyState
          icon={<Receipt size={22} strokeWidth={1.75} />}
          title="No records yet"
          description="Records linked to this wallet will appear here."
          action={
            <Link
              to="/records/new"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-gold-400 text-black text-sm font-medium hover:bg-gold-300 transition-colors"
            >
              Add a record
            </Link>
          }
        />
      )}

      {records !== null && records.length > 0 && (
        <div className="space-y-2">
          {records.map((r) => {
            const sign =
              r.class === 'income' || r.class === 'adjustment'
                ? '+'
                : r.class === 'expense'
                ? '−'
                : '';
            const tone =
              r.class === 'income'
                ? 'text-[var(--sys-green)]'
                : r.class === 'expense'
                ? 'text-[var(--sys-red)]'
                : r.class === 'transfer'
                ? 'text-[var(--sys-blue)]'
                : 'text-[var(--sys-orange)]';
            return (
              <Link
                key={r.id}
                to={`/records/${r.id}`}
                className="glass p-3 flex items-center gap-3 hover:bg-white/[0.06] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{r.counterparty || RECORD_CLASS_LABELS[r.class]}</p>
                  <p className="text-xs text-mute truncate">
                    {formatDate(r.occurredAt)} · {RECORD_CLASS_LABELS[r.class]}
                  </p>
                </div>
                <p className={`text-sm font-semibold shrink-0 ${tone}`}>
                  {sign}
                  {formatMinor(r.amountMinor, wallet.currency)}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
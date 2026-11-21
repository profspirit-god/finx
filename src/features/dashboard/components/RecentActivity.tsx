import { Link } from 'react-router-dom';
import {
  ArrowDownLeft, ArrowUpRight, ArrowRightLeft, SlidersHorizontal, ArrowRight,
} from 'lucide-react';
import { useRecords } from '@/features/records/hooks/useRecords';
import { useWallets } from '@/features/wallets/hooks/useWallets';
import { RECORD_CLASS_LABELS, type CashflowClass } from '@/types/record';
import { formatMinor } from '@/lib/format/currency';
import { formatRelative } from '@/lib/format/date';

const ICONS = {
  income: ArrowDownLeft,
  expense: ArrowUpRight,
  transfer: ArrowRightLeft,
  adjustment: SlidersHorizontal,
};

const TONES: { [K in CashflowClass]: string } = {
  income: 'text-[var(--sys-green)] bg-[var(--sys-green)]/15',
  expense: 'text-[var(--sys-red)] bg-[var(--sys-red)]/15',
  transfer: 'text-[var(--sys-blue)] bg-[var(--sys-blue)]/15',
  adjustment: 'text-[var(--sys-orange)] bg-[var(--sys-orange)]/15',
};

const AMOUNT_TONES: { [K in CashflowClass]: string } = {
  income: 'text-[var(--sys-green)]',
  expense: 'text-[var(--sys-red)]',
  transfer: 'text-[var(--sys-blue)]',
  adjustment: 'text-[var(--sys-orange)]',
};

export default function RecentActivity() {
  const { records } = useRecords();
  const { wallets } = useWallets();
  const recent = [...records]
    .filter((r) => r.deletedAt === null)
    .sort((a, b) => b.occurredAt - a.occurredAt)
    .slice(0, 5);

  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Recent activity</h2>
        <Link
          to="/records"
          className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1"
        >
          View all <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-dim py-4 text-center">
          No records yet. Add your first one from Records.
        </p>
      ) : (
        <div className="space-y-1.5">
          {recent.map((r) => {
            const wallet = wallets.find((w) => w.id === r.walletId);
            const Icon = ICONS[r.class];
            const sign =
              r.class === 'income' || r.class === 'adjustment'
                ? '+'
                : r.class === 'expense'
                ? '−'
                : '';
            return (
              <Link
                key={r.id}
                to={`/records/${r.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${TONES[r.class]}`}>
                  <Icon size={14} strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm truncate">{r.counterparty || RECORD_CLASS_LABELS[r.class]}</p>
                  <p className="text-xs text-mute truncate">
                    {formatRelative(r.occurredAt)} · {wallet?.name ?? 'Unknown'}
                  </p>
                </div>
                <p className={`text-sm font-semibold shrink-0 ${AMOUNT_TONES[r.class]}`}>
                  {sign}
                  {formatMinor(r.amountMinor, wallet?.currency ?? 'USD')}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
import { Link } from 'react-router-dom';
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft, SlidersHorizontal, Receipt as ReceiptIcon } from 'lucide-react';
import { RECORD_CLASS_LABELS, RECORD_CLASS_TONES, type Record, type CashflowClass } from '@/types/record';
import { formatMinor } from '@/lib/format/currency';
import { formatDate } from '@/lib/format/date';
import { useWallets } from '@/features/wallets/hooks/useWallets';

const ICONS = {
  income: ArrowDownLeft,
  expense: ArrowUpRight,
  transfer: ArrowRightLeft,
  adjustment: SlidersHorizontal,
} satisfies { [K in CashflowClass]: typeof ArrowDownLeft };

const TONE_CLASSES: { [K in CashflowClass]: string } = {
  income: 'text-[var(--sys-green)] bg-[var(--sys-green)]/15',
  expense: 'text-[var(--sys-red)] bg-[var(--sys-red)]/15',
  transfer: 'text-[var(--sys-blue)] bg-[var(--sys-blue)]/15',
  adjustment: 'text-[var(--sys-orange)] bg-[var(--sys-orange)]/15',
};

export default function RecordRow({ record }: { record: Record }) {
  const { wallets } = useWallets();
  const wallet = wallets.find((w) => w.id === record.walletId);
  const Icon = ICONS[record.class];
  const sign =
    record.class === 'income' || record.class === 'adjustment'
      ? '+'
      : record.class === 'expense'
      ? '−'
      : '';

  return (
    <Link
      to={`/records/${record.id}`}
      className="glass p-3 flex items-center gap-3 hover:bg-white/[0.06] transition-colors group"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${TONE_CLASSES[record.class]}`}>
        <Icon size={18} strokeWidth={1.75} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">
            {record.counterparty || RECORD_CLASS_LABELS[record.class]}
          </p>
          {record.receiptId && <ReceiptIcon size={12} className="text-gold-400 shrink-0" />}
        </div>
        <p className="text-xs text-mute truncate">
          {formatDate(record.occurredAt)} · {wallet?.name ?? 'Unknown wallet'} · {RECORD_CLASS_LABELS[record.class]}
        </p>
        {record.note && <p className="text-xs text-dim truncate mt-0.5">{record.note}</p>}
      </div>

      <div className="text-right shrink-0">
        <p
          className={`text-sm font-semibold ${
            record.class === 'income'
              ? 'text-[var(--sys-green)]'
              : record.class === 'expense'
              ? 'text-[var(--sys-red)]'
              : record.class === 'transfer'
              ? 'text-[var(--sys-blue)]'
              : 'text-[var(--sys-orange)]'
          }`}
        >
          {sign}
          {formatMinor(record.amountMinor, wallet?.currency ?? 'USD')}
        </p>
      </div>
    </Link>
  );
}
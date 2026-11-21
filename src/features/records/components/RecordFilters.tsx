import type { CashflowClass } from '@/types/record';
import { RECORD_CLASS_LABELS } from '@/types/record';
import { Input, Select } from '@/ui';
import type { Wallet } from '@/types/wallet';

export type FilterState = {
  class: CashflowClass | 'all';
  walletId: string | 'all';
  from: string;
  to: string;
  search: string;
};

const CLASS_OPTIONS: { value: CashflowClass | 'all'; label: string }[] = [
  { value: 'all', label: 'All classes' },
  { value: 'income', label: RECORD_CLASS_LABELS.income },
  { value: 'expense', label: RECORD_CLASS_LABELS.expense },
  { value: 'transfer', label: RECORD_CLASS_LABELS.transfer },
  { value: 'adjustment', label: RECORD_CLASS_LABELS.adjustment },
];

export default function RecordFilters({
  filters,
  wallets,
  onChange,
}: {
  filters: FilterState;
  wallets: Wallet[];
  onChange: (next: FilterState) => void;
}) {
  const walletOptions = [
    { value: 'all', label: 'All wallets' },
    ...wallets.filter((w) => !w.archived).map((w) => ({ value: w.id, label: w.name })),
  ];

  return (
    <div className="glass p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
      <Input
        placeholder="Search counterparty or note"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />
      <Select
        value={filters.class}
        onChange={(e) => onChange({ ...filters, class: e.target.value as CashflowClass | 'all' })}
        options={CLASS_OPTIONS}
      />
      <Select
        value={filters.walletId}
        onChange={(e) => onChange({ ...filters, walletId: e.target.value })}
        options={walletOptions}
      />
      <Input
        type="date"
        placeholder="From"
        value={filters.from}
        onChange={(e) => onChange({ ...filters, from: e.target.value })}
      />
      <Input
        type="date"
        placeholder="To"
        value={filters.to}
        onChange={(e) => onChange({ ...filters, to: e.target.value })}
      />
    </div>
  );
}
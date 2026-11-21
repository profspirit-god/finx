import { Tabs } from '@/ui';
import { formatMinor } from '@/lib/format/currency';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { RateStats } from '../lib/stats';

type Mode = 'month' | 'day' | 'year';

type Props = {
  rates: RateStats;
  currency: string;
  mode: Mode;
  onModeChange: (m: Mode) => void;
};

export default function RateCards({ rates, currency, mode, onModeChange }: Props) {
  const income = mode === 'month' ? rates.incomePerMonth : mode === 'day' ? rates.incomePerDay : rates.incomePerYear;
  const expense = mode === 'month' ? rates.expensePerMonth : mode === 'day' ? rates.expensePerDay : rates.expensePerYear;
  const incomeLabel = mode === 'month' ? 'Monthly income' : mode === 'day' ? 'Daily income' : 'Yearly income';
  const expenseLabel = mode === 'month' ? 'Monthly expense' : mode === 'day' ? 'Daily expense' : 'Yearly expense';
  const net = income - expense;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Rates</h2>
        <Tabs
          tabs={[
            { id: 'month', label: 'Monthly' },
            { id: 'day', label: 'Daily' },
            { id: 'year', label: 'Yearly' },
          ]}
          active={mode}
          onChange={(id) => onModeChange(id as Mode)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RateCard
          label={incomeLabel}
          value={formatMinor(income, currency)}
          Icon={TrendingUp}
          tone="text-[var(--sys-green)]"
          bg="bg-[var(--sys-green)]/15"
        />
        <RateCard
          label={expenseLabel}
          value={formatMinor(expense, currency)}
          Icon={TrendingDown}
          tone="text-[var(--sys-red)]"
          bg="bg-[var(--sys-red)]/15"
        />
      </div>
      <div className="glass p-3 flex items-center justify-between text-sm">
        <span className="text-dim">Net {mode === 'month' ? 'monthly' : mode === 'day' ? 'daily' : 'yearly'}</span>
        <span className={`font-semibold ${net >= 0 ? 'text-[var(--sys-green)]' : 'text-[var(--sys-red)]'}`}>
          {net >= 0 ? '+' : '−'}
          {formatMinor(Math.abs(net), currency)}
        </span>
      </div>
    </div>
  );
}

function RateCard({
  label,
  value,
  Icon,
  tone,
  bg,
}: {
  label: string;
  value: string;
  Icon: typeof TrendingUp;
  tone: string;
  bg: string;
}) {
  return (
    <div className="glass p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
        <Icon size={18} strokeWidth={1.75} className={tone} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-mute truncate">{label}</p>
        <p className={`text-lg font-semibold truncate ${tone}`}>{value}</p>
      </div>
    </div>
  );
}
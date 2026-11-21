import { Wallet, TrendingDown, TrendingUp, LineChart } from 'lucide-react';
import { formatMinor } from '@/lib/format/currency';
import type { DashboardStats } from '../lib/stats';

type Props = { stats: DashboardStats; currency: string };

export default function SummaryCards({ stats, currency }: Props) {
  const cards = [
    {
      label: 'Total money',
      value: formatMinor(stats.totalMoney, currency),
      sub: `${stats.walletsCount} ${stats.walletsCount === 1 ? 'wallet' : 'wallets'}`,
      Icon: Wallet,
      tone: 'text-gold-400',
    },
    {
      label: 'Income',
      value: formatMinor(stats.periodTotals.income, currency),
      sub: 'in selected period',
      Icon: TrendingUp,
      tone: 'text-[var(--sys-green)]',
    },
    {
      label: 'Expenses',
      value: formatMinor(stats.periodTotals.expense, currency),
      sub: 'in selected period',
      Icon: TrendingDown,
      tone: 'text-[var(--sys-red)]',
    },
    {
      label: 'Investments',
      value: formatMinor(stats.investments, currency),
      sub: 'investment wallets',
      Icon: LineChart,
      tone: 'text-[var(--sys-blue)]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, sub, Icon, tone }) => (
        <div key={label} className="glass p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-mute">{label}</p>
            <Icon size={18} strokeWidth={1.75} className={tone} />
          </div>
          <p className="text-2xl font-semibold mt-2 truncate">{value}</p>
          <p className="text-xs text-mute mt-0.5 truncate">{sub}</p>
        </div>
      ))}
    </div>
  );
}
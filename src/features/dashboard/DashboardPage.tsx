import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Wallet } from 'lucide-react';
import { Button, EmptyState, ErrorState, Skeleton } from '@/ui';
import { useDashboardStats } from './hooks/useDashboardStats';
import { useWallets } from '@/features/wallets/hooks/useWallets';
import SummaryCards from './components/SummaryCards';
import RateCards from './components/RateCards';
import TimeRangeSelector from './components/TimeRangeSelector';
import NetWorthChart from './components/NetWorthChart';
import CashflowChart from './components/CashflowChart';
import InvestmentDonut from './components/InvestmentDonut';
import RecentActivity from './components/RecentActivity';
import type { TimeRange } from './lib/stats';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { DashboardNoticeBanner } from '@/features/notices';

type RateMode = 'month' | 'day' | 'year';

export default function DashboardPage() {
  const [range, setRange] = useState<TimeRange>('month');
  const [rateMode, setRateMode] = useState<RateMode>('month');
  const { stats, loading, error } = useDashboardStats(range);
  const { wallets } = useWallets();

  const settingsCurrency = useCurrency();
  const currency = useMemo(
    () => wallets.find((w) => !w.archived)?.currency ?? settingsCurrency,
    [wallets, settingsCurrency],
  );

  if (error) {
    return (
      <div className="p-4">
        <ErrorState
          title="Dashboard unavailable"
          description={error}
          onRetry={() => window.location.reload()}
          helpHref="/help#data-errors"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <DashboardNoticeBanner />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-dim mt-1">Snapshot of your money.</p>
        </div>
        <TimeRangeSelector value={range} onChange={setRange} />
      </div>

      {loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass p-4 space-y-2">
                <Skeleton width="40%" height={12} />
                <Skeleton width="70%" height={24} />
                <Skeleton width="30%" height={10} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton width="100%" height={240} rounded="lg" />
            <Skeleton width="100%" height={240} rounded="lg" />
          </div>
        </>
      )}

      {!loading && stats && stats.walletsCount === 0 && (
        <EmptyState
          icon={<Wallet size={22} strokeWidth={1.75} />}
          title="No wallets yet"
          description="Create your first wallet to start tracking money."
          action={
            <Link to="/wallets/new">
              <Button leftIcon={<Plus size={16} strokeWidth={2} />}>Create wallet</Button>
            </Link>
          }
        />
      )}

      {!loading && stats && stats.walletsCount > 0 && (
        <>
          <SummaryCards stats={stats} currency={currency} />
          <RateCards
            rates={stats.rates}
            currency={currency}
            mode={rateMode}
            onModeChange={setRateMode}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <NetWorthChart data={stats.netWorth} currency={currency} />
            <CashflowChart data={stats.cashflow} currency={currency} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RecentActivity />
            <InvestmentDonut wallets={wallets} currency={currency} />
          </div>
        </>
      )}
    </div>
  );
}
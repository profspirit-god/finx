import { useMemo } from 'react';
import { useWallets } from '@/features/wallets/hooks/useWallets';
import { useRecords } from '@/features/records/hooks/useRecords';
import { computeDashboard, type TimeRange, type DashboardStats } from '../lib/stats';

export function useDashboardStats(range: TimeRange): {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
} {
  const { wallets, loadState: walletState } = useWallets();
  const { records, loadState: recordState } = useRecords();

  const loading =
    walletState === 'idle' ||
    walletState === 'loading' ||
    recordState === 'idle' ||
    recordState === 'loading';

  const stats = useMemo<DashboardStats | null>(() => {
    if (loading) return null;
    return computeDashboard(wallets, records, range);
  }, [wallets, records, range, loading]);

  const error =
    walletState === 'error' ? 'Could not load wallets.' :
    recordState === 'error' ? 'Could not load records.' :
    null;

  return { stats, loading, error };
}
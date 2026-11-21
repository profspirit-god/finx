import { Plus, Wallet as WalletIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, EmptyState, ErrorState, Skeleton } from '@/ui';
import { useWallets } from '../hooks/useWallets';
import WalletCard from './WalletCard';

export default function WalletList() {
  const { wallets, loadState, error, refresh } = useWallets();
  const active = wallets.filter((w) => !w.archived);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Wallets</h1>
          <p className="text-sm text-dim mt-1">
            {active.length} active {active.length === 1 ? 'wallet' : 'wallets'}
          </p>
        </div>
        <Link to="/wallets/new">
          <Button leftIcon={<Plus size={16} strokeWidth={2} />}>Add wallet</Button>
        </Link>
      </div>

      {loadState === 'loading' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass p-4 space-y-3">
              <Skeleton width={40} height={40} rounded="lg" />
              <Skeleton width="70%" height={14} />
              <Skeleton width="40%" height={20} />
            </div>
          ))}
        </div>
      )}

      {loadState === 'error' && (
        <ErrorState
          title="Couldn't load wallets"
          description={error ?? 'Please try again.'}
          onRetry={refresh}
          helpHref="/help"
        />
      )}

      {loadState === 'ready' && active.length === 0 && (
        <EmptyState
          icon={<WalletIcon size={22} strokeWidth={1.75} />}
          title="No wallets yet"
          description="Wallets hold the money you want to track — cash, bank accounts, e-wallets, investments."
          action={
            <Link to="/wallets/new">
              <Button leftIcon={<Plus size={16} strokeWidth={2} />}>Create your first wallet</Button>
            </Link>
          }
        />
      )}

      {loadState === 'ready' && active.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.map((w) => (
            <WalletCard key={w.id} wallet={w} />
          ))}
        </div>
      )}
    </div>
  );
}
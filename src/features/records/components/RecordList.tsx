import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Receipt } from 'lucide-react';
import { Button, EmptyState, ErrorState, Skeleton } from '@/ui';
import { useRecords } from '../hooks/useRecords';
import { useWalletsStore } from '@/features/wallets/state/wallets.store';
import RecordRow from './RecordRow';
import RecordFilters, { type FilterState } from './RecordFilters';
import { useWallets } from '@/features/wallets/hooks/useWallets';

const INITIAL: FilterState = { class: 'all', walletId: 'all', from: '', to: '', search: '' };

export default function RecordList() {
  const { records, loadState, error, refresh } = useRecords();
  const { wallets } = useWallets();
  const [filters, setFilters] = useState<FilterState>(INITIAL);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const fromTs = filters.from ? new Date(filters.from).getTime() : null;
    const toTs = filters.to ? new Date(filters.to).getTime() + 86_400_000 - 1 : null;
    return records.filter((r) => {
      if (filters.class !== 'all' && r.class !== filters.class) return false;
      if (filters.walletId !== 'all' && r.walletId !== filters.walletId) return false;
      if (fromTs !== null && r.occurredAt < fromTs) return false;
      if (toTs !== null && r.occurredAt > toTs) return false;
      if (q) {
        const hay = `${r.counterparty} ${r.note} ${r.tags.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [records, filters]);

  const hasFilters =
    filters.class !== 'all' || filters.walletId !== 'all' || !!filters.from || !!filters.to || !!filters.search;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Records</h1>
          <p className="text-sm text-dim mt-1">
            {filtered.length} {filtered.length === 1 ? 'record' : 'records'}
            {hasFilters ? ' (filtered)' : ''}
          </p>
        </div>
        <Link to="/records/new">
          <Button leftIcon={<Plus size={16} strokeWidth={2} />}>New record</Button>
        </Link>
      </div>

      <RecordFilters filters={filters} wallets={wallets} onChange={setFilters} />

      {loadState === 'loading' && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass p-3 flex items-center gap-3">
              <Skeleton width={40} height={40} rounded="lg" />
              <div className="flex-1 space-y-2">
                <Skeleton width="50%" height={14} />
                <Skeleton width="30%" height={12} />
              </div>
              <Skeleton width={80} height={20} />
            </div>
          ))}
        </div>
      )}

      {loadState === 'error' && (
        <ErrorState
          title="Couldn't load records"
          description={error ?? 'Please try again.'}
          onRetry={refresh}
          helpHref="/help#data-errors"
        />
      )}

      {loadState === 'ready' && records.length === 0 && (
        <EmptyState
          icon={<Receipt size={22} strokeWidth={1.75} />}
          title="No records yet"
          description="Record money movements — income, expenses, transfers, and adjustments."
          action={
            <Link to="/records/new">
              <Button leftIcon={<Plus size={16} strokeWidth={2} />}>Create your first record</Button>
            </Link>
          }
        />
      )}

      {loadState === 'ready' && records.length > 0 && filtered.length === 0 && (
        <EmptyState
          title="No records match these filters"
          description="Try clearing a filter or widening the date range."
          action={<Button variant="secondary" onClick={() => setFilters(INITIAL)}>Clear filters</Button>}
        />
      )}

      {loadState === 'ready' && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((r) => (
            <RecordRow key={r.id} record={r} />
          ))}
        </div>
      )}
    </div>
  );
}
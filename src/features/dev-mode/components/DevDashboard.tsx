import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button, EmptyState, ErrorState, Notice, Select, Skeleton, useToast } from '@/ui';
import FeedbackRow from './FeedbackRow';
import LocalStatsCard from './LocalStatsCard';
import { getDevSession, signOutDev, type DevSession } from '../auth';
import { listFeedback, setHandled, PAGE_SIZE, type FeedbackFilter } from '../api';
import type { FeedbackRow as Row, FeedbackType } from '@/features/feedback/types';

const INITIAL_FILTER: FeedbackFilter = { type: 'all', handled: 'unhandled' };

export default function DevDashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const [session, setSession] = useState<DevSession | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState<FeedbackFilter>(INITIAL_FILTER);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async (resetOffset = false) => {
    setLoading(true);
    setError(null);
    try {
      const nextOffset = resetOffset ? 0 : offset;
      const { rows, count } = await listFeedback(filter, nextOffset);
      setRows(rows);
      setTotal(count);
      if (resetOffset) setOffset(0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      const s = await getDevSession();
      setSession(s);
    })();
  }, []);

  useEffect(() => {
    void load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const toggleHandled = async (row: Row) => {
    setBusyId(row.id);
    try {
      await setHandled(row.id, !row.handled);
      // Remove from list if filter excludes the new state
      setRows((prev) => {
        if (!prev) return prev;
        if (filter.handled !== 'all') {
          const matches =
            (filter.handled === 'handled' && !row.handled) ||
            (filter.handled === 'unhandled' && row.handled);
          if (matches) return prev.filter((r) => r.id !== row.id);
        }
        return prev.map((r) => (r.id === row.id ? { ...r, handled: !r.handled } : r));
      });
      toast.push({ variant: 'success', title: row.handled ? 'Unmarked' : 'Marked as handled', message: '' });
    } catch (err) {
      toast.push({ variant: 'error', title: 'Failed', message: (err as Error).message });
    } finally {
      setBusyId(null);
    }
  };

  const handleSignOut = async () => {
    await signOutDev();
    navigate('/dev-login', { replace: true });
  };

  const canPrev = offset > 0;
  const canNext = offset + PAGE_SIZE < total;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Developer dashboard</h1>
          <p className="text-sm text-dim mt-1">
            {session?.email ?? '…'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<RefreshCw size={14} />} onClick={() => void load(true)} loading={loading}>
            Refresh
          </Button>
          <Button variant="ghost" leftIcon={<LogOut size={14} />} onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>

      <Notice variant="warning" title="Development view">
        This screen reads feedback from the Supabase backend. Your local FinX data is shown in the stats card only.
      </Notice>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value as FeedbackType | 'all' })}
              options={[
                { value: 'all', label: 'All types' },
                { value: 'bug', label: 'Bugs only' },
                { value: 'idea', label: 'Ideas only' },
              ]}
            />
            <Select
              value={filter.handled}
              onChange={(e) => setFilter({ ...filter, handled: e.target.value as FeedbackFilter['handled'] })}
              options={[
                { value: 'all', label: 'All' },
                { value: 'unhandled', label: 'Unhandled' },
                { value: 'handled', label: 'Handled' },
              ]}
            />
            <span className="text-xs text-mute ml-auto">
              {total} {total === 1 ? 'item' : 'items'}
            </span>
          </div>

          {error && (
            <ErrorState
              title="Could not load feedback"
              description={error}
              onRetry={() => void load(true)}
              helpHref="/help"
            />
          )}

          {loading && rows === null && (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} width="100%" height={80} rounded="lg" />
              ))}
            </div>
          )}

          {!loading && rows && rows.length === 0 && (
            <EmptyState
              title="No feedback yet"
              description={filter.type !== 'all' || filter.handled !== 'all'
                ? 'Try changing the filters.'
                : 'Bug reports and ideas submitted by beta users will appear here.'}
            />
          )}

          {rows && rows.length > 0 && (
            <div className="space-y-2">
              {rows.map((row) => (
                <FeedbackRow
                  key={row.id}
                  row={row}
                  busy={busyId === row.id}
                  onToggleHandled={() => void toggleHandled(row)}
                />
              ))}
            </div>
          )}

          {(canPrev || canNext) && (
            <div className="flex justify-between items-center pt-2">
              <Button variant="ghost" size="sm" disabled={!canPrev || loading} onClick={() => { setOffset(Math.max(0, offset - PAGE_SIZE)); void load(); }}>
                Previous
              </Button>
              <span className="text-xs text-mute">
                {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
              </span>
              <Button variant="ghost" size="sm" disabled={!canNext || loading} onClick={() => { setOffset(offset + PAGE_SIZE); void load(); }}>
                Next
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <LocalStatsCard />
          <div className="glass p-4 text-xs text-mute flex items-start gap-2">
            <AlertTriangle size={14} className="text-[var(--sys-orange)] shrink-0 mt-0.5" />
            <p>To delete a feedback row permanently, use the SQL Editor: <code className="text-white">delete from finx.feedback where id = ...</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
import { getFinxClient, getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import type { FeedbackRow, FeedbackType } from '@/features/feedback/types';

export type FeedbackFilter = {
  type: FeedbackType | 'all';
  handled: 'all' | 'handled' | 'unhandled';
};

export const PAGE_SIZE = 50;

export async function listFeedback(
  filter: FeedbackFilter,
  offset = 0,
): Promise<{ rows: FeedbackRow[]; count: number }> {
  if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
  const client = getFinxClient();

  let q = client
    .from('feedback')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (filter.type !== 'all') q = q.eq('type', filter.type);
  if (filter.handled === 'handled') q = q.eq('handled', true);
  if (filter.handled === 'unhandled') q = q.eq('handled', false);

  const { data, error, count } = await q;
  if (error) throw error;
  return { rows: (data ?? []) as FeedbackRow[], count: count ?? 0 };
}

export async function setHandled(id: string, handled: boolean): Promise<void> {
  const client = getFinxClient();
  const { error } = await client.from('feedback').update({ handled }).eq('id', id);
  if (error) throw error;
}

export async function deleteFeedbackRow(id: string): Promise<void> {
  // Deleting requires the DELETE policy — we haven't granted that to authenticated.
  // Instead, mark as handled and purge manually via SQL Editor (documented).
  throw new Error('Delete is not available in the app. Use SQL Editor: delete from finx.feedback where id = ...');
}

export async function signOutAdmin(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.auth.signOut();
}
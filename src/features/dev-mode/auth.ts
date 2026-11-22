import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export type DevSession = {
  userId: string;
  email: string;
};

export class DevAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DevAuthError';
  }
}

export async function signInDev(email: string, password: string): Promise<DevSession> {
  if (!isSupabaseConfigured()) throw new DevAuthError('Supabase not configured on this build.');
  const sb = getSupabase()!;
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw new DevAuthError(error.message);
  if (!data.user) throw new DevAuthError('Sign-in returned no user.');
  return { userId: data.user.id, email: data.user.email ?? email };
}

export async function signOutDev(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.auth.signOut();
}

export async function getDevSession(): Promise<DevSession | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  const user = data.session?.user;
  if (!user) return null;
  return { userId: user.id, email: user.email ?? '' };
}

export async function isAdminSession(): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { data } = await sb.auth.getSession();
  if (!data.session) return false;
  // Ask the server whether this user is in finx.admin_users
  const { data: admin, error } = await sb
    .schema('finx')
    .rpc('is_admin');
  if (error) return false;
  return admin === true;
}
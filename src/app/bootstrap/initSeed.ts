import { getDB } from '@/lib/db/idb';
import type { Settings } from '@/types/settings';

/**
 * Ensures a settings record exists. Called once at app start.
 * Users, wallets, records start empty; onboarding populates them.
 */
export async function initSeed(): Promise<void> {
  const db = await getDB();
  const existing = await db.get('settings', 'settings');
  if (existing) return;
  const defaults: Settings = {
    id: 'settings',
    theme: 'dark',
    currency: 'USD',
    locale: 'en-US',
    aiProviderBaseUrl: null,
    aiApiKey: null,
    lastBackupAt: null,
    updatedAt: Date.now(),
  };
  await db.put('settings', defaults);
}
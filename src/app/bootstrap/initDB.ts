import { getDB } from '@/lib/db/idb';
import { runMigrations } from '@/lib/db/migrations';

export async function initDB(): Promise<void> {
  await getDB();
  await runMigrations();
}
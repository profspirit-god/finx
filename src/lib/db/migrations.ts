import { getDB } from './idb';

/**
 * Reserved for future schema migrations. Currently the schema is at version 1
 * and is created in `idb.ts` during the initial `upgrade`. Future bumps should
 * add new `upgrade` branches there and use this module for data backfills.
 */
export async function runMigrations(): Promise<void> {
  const db = await getDB();
  void db;
}
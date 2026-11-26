import { openDB, type IDBPDatabase } from 'idb';
import { DB_NAME, DB_VERSION, type FinXDB } from './schema';

let dbPromise: Promise<IDBPDatabase<FinXDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<FinXDB>> {
  if (!dbPromise) {
    dbPromise = openDB<FinXDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // v1 → v0 (fresh install)
        if (oldVersion < 1) {
          if (!db.objectStoreNames.contains('users')) {
            db.createObjectStore('users', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('wallets')) {
            const w = db.createObjectStore('wallets', { keyPath: 'id' });
            w.createIndex('by-updated', 'updatedAt');
            w.createIndex('by-type', 'type');
          }
          if (!db.objectStoreNames.contains('records')) {
            const r = db.createObjectStore('records', { keyPath: 'id' });
            r.createIndex('by-wallet', 'walletId');
            r.createIndex('by-created', 'createdAt');
            r.createIndex('by-occurred', 'occurredAt');
          }
          if (!db.objectStoreNames.contains('receipts')) {
            const rc = db.createObjectStore('receipts', { keyPath: 'id' });
            rc.createIndex('by-record', 'recordId');
          }
        }
        // v1 → v2: AI stores
        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains('ai_settings')) {
            db.createObjectStore('ai_settings', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('ai_messages')) {
            const m = db.createObjectStore('ai_messages', { keyPath: 'id' });
            m.createIndex('by-created', 'createdAt');
          }
        }
      },
      blocked() {
        console.warn('[FinX] IndexedDB blocked by another tab');
      },
      blocking() {
        console.warn('[FinX] IndexedDB blocking — reload recommended');
      },
      terminated() {
        console.warn('[FinX] IndexedDB terminated');
      },
    });
  }
  return dbPromise;
}

export type StoreName = 'users' | 'settings' | 'wallets' | 'records' | 'receipts' | 'ai_settings' | 'ai_messages';

export async function dbGetAll(store: StoreName) {
  const db = await getDB();
  return db.getAll(store);
}

export async function dbClearAll(): Promise<void> {
  const db = await getDB();
  const stores: StoreName[] = ['users', 'settings', 'wallets', 'records', 'receipts', 'ai_settings', 'ai_messages'];
  const tx = db.transaction(stores, 'readwrite');
  await Promise.all([...stores.map((s) => tx.objectStore(s).clear()), tx.done]);
}
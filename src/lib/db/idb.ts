import { openDB, type IDBPDatabase } from 'idb';
import { DB_NAME, DB_VERSION, type FinXDB } from './schema';

let dbPromise: Promise<IDBPDatabase<FinXDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<FinXDB>> {
  if (!dbPromise) {
    dbPromise = openDB<FinXDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
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

export type StoreName = 'users' | 'settings' | 'wallets' | 'records' | 'receipts';

export async function dbGetAll(store: StoreName) {
  const db = await getDB();
  return db.getAll(store);
}

export async function dbClearAll(): Promise<void> {
  const db = await getDB();
  const stores: StoreName[] = ['users', 'settings', 'wallets', 'records', 'receipts'];
  const tx = db.transaction(stores, 'readwrite');
  await Promise.all([...stores.map((s) => tx.objectStore(s).clear()), tx.done]);
}
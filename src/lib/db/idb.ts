import { openDB, type IDBPDatabase } from 'idb';
import { DB_NAME, DB_VERSION, type FinXDB } from './schema';

let dbPromise: Promise<IDBPDatabase<FinXDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<FinXDB>> {
  if (!dbPromise) {
    dbPromise = openDB<FinXDB>(DB_NAME, DB_VERSION, {
      async upgrade(db, oldVersion, newVersion, transaction) {
        // 1. Initial Schema
        if (oldVersion < 1) {
          db.createObjectStore('users', { keyPath: 'id' });
          db.createObjectStore('settings', { keyPath: 'id' });
          const w = db.createObjectStore('wallets', { keyPath: 'id' });
          w.createIndex('by-updated', 'updatedAt');
          w.createIndex('by-type', 'type');
          const r = db.createObjectStore('records', { keyPath: 'id' });
          r.createIndex('by-wallet', 'walletId');
          r.createIndex('by-created', 'createdAt');
          r.createIndex('by-occurred', 'occurredAt');
          const rc = db.createObjectStore('receipts', { keyPath: 'id' });
          rc.createIndex('by-record', 'recordId');
        }

        // 2. AI Settings (v2)
        if (oldVersion < 2) {
          db.createObjectStore('ai_settings', { keyPath: 'id' });
          const m = db.createObjectStore('ai_messages', { keyPath: 'id' });
          m.createIndex('by-created', 'createdAt');
        }

        // 3. AI History (v3)
        if (oldVersion < 3) {
          const conv = db.createObjectStore('ai_conversations', { keyPath: 'id' });
          conv.createIndex('by-updated', 'updatedAt');

          // Recreate ai_messages to add the new index and handle migration
          db.deleteObjectStore('ai_messages');
          const msgs = db.createObjectStore('ai_messages', { keyPath: 'id' });
          msgs.createIndex('by-conversation', 'conversationId');
          msgs.createIndex('by-created', 'createdAt');
          
          // Note: Since we deleted the store, existing test messages are wiped.
          // This is acceptable for beta and avoids complex async migration logic.
        }
      },
      blocked() { console.warn('[FinX] IndexedDB blocked by another tab'); },
      blocking() { console.warn('[FinX] IndexedDB blocking — reload recommended'); },
      terminated() { console.warn('[FinX] IndexedDB terminated'); },
    });
  }
  return dbPromise;
}

export type StoreName = 'users' | 'settings' | 'wallets' | 'records' | 'receipts' | 'ai_settings' | 'ai_conversations' | 'ai_messages';

export async function dbGetAll(store: StoreName) {
  const db = await getDB();
  return db.getAll(store);
}

export async function dbClearAll(): Promise<void> {
  const db = await getDB();
  const stores: StoreName[] = ['users', 'settings', 'wallets', 'records', 'receipts', 'ai_settings', 'ai_conversations', 'ai_messages'];
  const tx = db.transaction(stores, 'readwrite');
  await Promise.all([...stores.map((s) => tx.objectStore(s).clear()), tx.done]);
}
import type { FinXBackup, SerializedReceipt } from './schema';
import { BACKUP_VERSION } from './schema';
import { getDB } from '@/lib/db/idb';

export type ImportResult = {
  users: number;
  settings: number;
  wallets: number;
  records: number;
  receipts: number;
};

export async function parseBackupFile(file: File): Promise<FinXBackup> {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('File is not valid JSON.');
  }
  return validateBackup(parsed);
}

export function validateBackup(input: unknown): FinXBackup {
  if (!input || typeof input !== 'object') throw new Error('Backup must be a JSON object.');
  const obj = input as Record<string, unknown>;
  if (obj.app !== 'FinX') throw new Error('Not a FinX backup file.');
  if (obj.version !== BACKUP_VERSION) {
    throw new Error(`Unsupported backup version: ${String(obj.version)} (expected ${BACKUP_VERSION}).`);
  }
  const required = ['users', 'settings', 'wallets', 'records', 'receipts'] as const;
  for (const key of required) {
    if (!Array.isArray(obj[key])) throw new Error(`Backup missing or malformed: ${key}`);
  }
  return obj as unknown as FinXBackup;
}

export async function writeBackup(backup: FinXBackup, mode: 'replace' | 'merge'): Promise<ImportResult> {
  const db = await getDB();
  const stores = ['users', 'settings', 'wallets', 'records', 'receipts'] as const;
  const tx = db.transaction(stores, 'readwrite');

  if (mode === 'replace') {
    for (const s of stores) await tx.objectStore(s).clear();
  }

  for (const u of backup.users) await tx.objectStore('users').put(u);
  for (const s of backup.settings) await tx.objectStore('settings').put(s);
  for (const w of backup.wallets) await tx.objectStore('wallets').put(w);
  for (const r of backup.records) await tx.objectStore('records').put(r);
  for (const rc of backup.receipts) {
    const blob = base64ToBlob(rc.dataBase64, rc.mimeType);
    await tx.objectStore('receipts').put({
      id: rc.id,
      recordId: rc.recordId,
      mimeType: rc.mimeType,
      fileName: rc.fileName,
      createdAt: rc.createdAt,
      blob,
    });
  }
  await tx.done;

  return {
    users: backup.users.length,
    settings: backup.settings.length,
    wallets: backup.wallets.length,
    records: backup.records.length,
    receipts: backup.receipts.length,
  };
}

export async function exportFullBackup(): Promise<FinXBackup> {
  const db = await getDB();
  const [users, settings, wallets, records, receiptsRaw] = await Promise.all([
    db.getAll('users'),
    db.getAll('settings'),
    db.getAll('wallets'),
    db.getAll('records'),
    db.getAll('receipts'),
  ]);

  const receipts: SerializedReceipt[] = await Promise.all(
    receiptsRaw.map(async (r) => ({
      id: r.id,
      recordId: r.recordId,
      mimeType: r.mimeType,
      fileName: r.fileName,
      createdAt: r.createdAt,
      dataBase64: await blobToBase64(r.blob),
    })),
  );

  return {
    app: 'FinX',
    version: BACKUP_VERSION,
    exportedAt: Date.now(),
    users,
    settings,
    wallets,
    records,
    receipts,
  };
}

async function blobToBase64(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}

export async function updateBackupStamp(): Promise<void> {
  const db = await getDB();
  const s = await db.get('settings', 'settings');
  if (s) await db.put('settings', { ...s, lastBackupAt: Date.now(), updatedAt: Date.now() });
}
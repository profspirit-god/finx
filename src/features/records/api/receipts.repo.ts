import { getDB } from '@/lib/db/idb';
import { randomId } from '@/lib/crypto/random';
import type { StoredReceipt } from '@/lib/db/schema';

export async function saveReceipt(file: File, recordId: string): Promise<string> {
  const db = await getDB();
  const id = randomId();
  const receipt: StoredReceipt = {
    id,
    recordId,
    blob: file,
    mimeType: file.type || 'application/octet-stream',
    fileName: file.name,
    createdAt: Date.now(),
  };
  await db.put('receipts', receipt);
  return id;
}

export async function getReceipt(id: string): Promise<StoredReceipt | null> {
  const db = await getDB();
  return (await db.get('receipts', id)) ?? null;
}

export async function deleteReceipt(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('receipts', id);
}
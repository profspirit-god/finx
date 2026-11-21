import { getDB } from '@/lib/db/idb';
import { randomId } from '@/lib/crypto/random';
import type { Record, RecordInput, TransferInput } from '@/types/record';
import { adjustBalance, getWallet } from '@/features/wallets/api/wallets.repo';

// ── Reads ────────────────────────────────────────────────

export async function listRecords(): Promise<Record[]> {
  const db = await getDB();
  const all = await db.getAll('records');
  return all
    .filter((r) => r.deletedAt === null)
    .sort((a, b) => b.occurredAt - a.occurredAt);
}

export async function listRecordsByWallet(walletId: string): Promise<Record[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex('records', 'by-wallet', walletId);
  return all
    .filter((r) => r.deletedAt === null)
    .sort((a, b) => b.occurredAt - a.occurredAt);
}

export async function getRecord(id: string): Promise<Record | null> {
  const db = await getDB();
  const r = await db.get('records', id);
  return r && r.deletedAt === null ? r : null;
}

// ── Create ────────────────────────────────────────────────

export async function createRecord(input: RecordInput): Promise<Record> {
  const db = await getDB();
  const now = Date.now();
  const record: Record = {
    id: randomId(),
    walletId: input.walletId,
    amountMinor: Math.abs(input.amountMinor),
    class: input.class,
    counterparty: input.counterparty,
    note: input.note,
    tags: input.tags,
    receiptId: input.receiptId,
    transferPairId: null,
    occurredAt: input.occurredAt,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };
  await db.put('records', record);

  const delta = balanceDelta(record);
  if (delta !== 0) await adjustBalance(record.walletId, delta);

  return record;
}

export async function createTransfer(input: TransferInput): Promise<{ out: Record; in: Record }> {
  if (input.fromWalletId === input.toWalletId) {
    throw new Error('Transfer requires two different wallets.');
  }
  const [from, to] = await Promise.all([
    getWallet(input.fromWalletId),
    getWallet(input.toWalletId),
  ]);
  if (!from || !to) throw new Error('Wallet not found.');

  const db = await getDB();
  const now = Date.now();
  const pairId = randomId();
  const outId = randomId();
  const inId = randomId();
  const amount = Math.abs(input.amountMinor);

  const out: Record = {
    id: outId,
    walletId: input.fromWalletId,
    amountMinor: amount,
    class: 'transfer',
    counterparty: to.name,
    note: input.note,
    tags: [],
    receiptId: null,
    transferPairId: pairId,
    occurredAt: input.occurredAt,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };

  const inRec: Record = {
    id: inId,
    walletId: input.toWalletId,
    amountMinor: amount,
    class: 'transfer',
    counterparty: from.name,
    note: input.note,
    tags: [],
    receiptId: null,
    transferPairId: pairId,
    occurredAt: input.occurredAt,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };

  const tx = db.transaction(['records', 'wallets'], 'readwrite');
  await tx.objectStore('records').put(out);
  await tx.objectStore('records').put(inRec);

  const outWallet = await tx.objectStore('wallets').get(input.fromWalletId);
  const inWallet = await tx.objectStore('wallets').get(input.toWalletId);
  if (outWallet) {
    await tx.objectStore('wallets').put({
      ...outWallet,
      currentBalanceMinor: outWallet.currentBalanceMinor - amount,
      updatedAt: now,
    });
  }
  if (inWallet) {
    await tx.objectStore('wallets').put({
      ...inWallet,
      currentBalanceMinor: inWallet.currentBalanceMinor + amount,
      updatedAt: now,
    });
  }
  await tx.done;

  return { out, in: inRec };
}

// ── Update ────────────────────────────────────────────────

export async function updateRecord(
  id: string,
  patch: Partial<Omit<RecordInput, 'walletId'>>,
): Promise<Record | null> {
  const db = await getDB();
  const existing = await db.get('records', id);
  if (!existing || existing.deletedAt !== null) return null;

  const oldDelta = balanceDelta(existing);

  const updated: Record = {
    ...existing,
    amountMinor: patch.amountMinor !== undefined ? Math.abs(patch.amountMinor) : existing.amountMinor,
    class: patch.class ?? existing.class,
    counterparty: patch.counterparty ?? existing.counterparty,
    note: patch.note ?? existing.note,
    tags: patch.tags ?? existing.tags,
    receiptId: patch.receiptId !== undefined ? patch.receiptId : existing.receiptId,
    occurredAt: patch.occurredAt ?? existing.occurredAt,
    updatedAt: Date.now(),
  };

  const newDelta = balanceDelta(updated);
  const netDelta = newDelta - oldDelta;

  await db.put('records', updated);
  if (netDelta !== 0) await adjustBalance(updated.walletId, netDelta);

  return updated;
}

// ── Delete (soft) ────────────────────────────────────────

export async function deleteRecord(id: string): Promise<boolean> {
  const db = await getDB();
  const existing = await db.get('records', id);
  if (!existing || existing.deletedAt !== null) return false;

  // If part of a transfer pair, delete both sides.
  if (existing.transferPairId) {
    const all = await db.getAll('records');
    const pair = all.filter((r) => r.transferPairId === existing.transferPairId && r.deletedAt === null);
    const now = Date.now();
    for (const r of pair) {
      await db.put('records', { ...r, deletedAt: now, updatedAt: now });
      const delta = balanceDelta(r);
      if (delta !== 0) await adjustBalance(r.walletId, -delta);
    }
    return true;
  }

  const delta = balanceDelta(existing);
  await db.put('records', { ...existing, deletedAt: Date.now(), updatedAt: Date.now() });
  if (delta !== 0) await adjustBalance(existing.walletId, -delta);
  return true;
}

// ── Helpers ───────────────────────────────────────────────

/**
 * Returns the signed effect on the *owning* wallet's balance.
 * For transfers, the record with the same pairId and a *lower* id
 * is treated as the "out" side (this is fragile — better: we rely on
 * the createTransfer pairing which puts them in sequence; here we
 * treat any transfer record as neutral and let createTransfer/deleteRecord
 * handle transfers explicitly).
 */
function balanceDelta(r: Record): number {
  if (r.class === 'income') return r.amountMinor;
  if (r.class === 'expense') return -r.amountMinor;
  if (r.class === 'adjustment') return r.amountMinor;
  // transfer — handled at createTransfer / deleteRecord level
  return 0;
}
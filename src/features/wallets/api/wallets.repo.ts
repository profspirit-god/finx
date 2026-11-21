import { getDB } from '@/lib/db/idb';
import { randomId } from '@/lib/crypto/random';
import type { Wallet, WalletInput } from '@/types/wallet';

export async function listWallets(includeArchived = false): Promise<Wallet[]> {
  const db = await getDB();
  const all = await db.getAll('wallets');
  const filtered = includeArchived ? all : all.filter((w) => !w.archived);
  return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getWallet(id: string): Promise<Wallet | null> {
  const db = await getDB();
  return (await db.get('wallets', id)) ?? null;
}

export async function createWallet(input: WalletInput): Promise<Wallet> {
  const db = await getDB();
  const now = Date.now();
  const wallet: Wallet = {
    id: randomId(),
    name: input.name,
    description: input.description,
    type: input.type,
    currency: input.currency,
    startingBalanceMinor: input.startingBalanceMinor,
    currentBalanceMinor: input.startingBalanceMinor,
    color: input.color,
    iconKey: input.iconKey ?? null,
    targetAmountMinor: input.targetAmountMinor ?? null,
    targetDate: input.targetDate ?? null,
    archived: false,
    createdAt: now,
    updatedAt: now,
  };
  await db.put('wallets', wallet);
  return wallet;
}

export async function updateWallet(id: string, patch: Partial<WalletInput>): Promise<Wallet | null> {
  const db = await getDB();
  const existing = await db.get('wallets', id);
  if (!existing) return null;
  const updated: Wallet = {
    ...existing,
    ...patch,
    iconKey: patch.iconKey !== undefined ? patch.iconKey : existing.iconKey,
    targetAmountMinor:
      patch.targetAmountMinor !== undefined ? patch.targetAmountMinor : existing.targetAmountMinor,
    targetDate: patch.targetDate !== undefined ? patch.targetDate : existing.targetDate,
    updatedAt: Date.now(),
  };
  await db.put('wallets', updated);
  return updated;
}

export async function archiveWallet(id: string): Promise<boolean> {
  const db = await getDB();
  const existing = await db.get('wallets', id);
  if (!existing) return false;
  await db.put('wallets', { ...existing, archived: true, updatedAt: Date.now() });
  return true;
}

export async function deleteWallet(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('wallets', id);
}

export async function adjustBalance(id: string, deltaMinor: number): Promise<Wallet | null> {
  const db = await getDB();
  const existing = await db.get('wallets', id);
  if (!existing) return null;
  const updated: Wallet = {
    ...existing,
    currentBalanceMinor: existing.currentBalanceMinor + deltaMinor,
    updatedAt: Date.now(),
  };
  await db.put('wallets', updated);
  return updated;
}
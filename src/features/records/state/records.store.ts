import { create } from 'zustand';
import type { Record, RecordInput, TransferInput } from '@/types/record';
import {
  createRecord,
  createTransfer,
  deleteRecord,
  getRecord,
  listRecords,
  listRecordsByWallet,
  updateRecord,
} from '../api/records.repo';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

type RecordsStore = {
  records: Record[];
  loadState: LoadState;
  error: string | null;
  loaded: boolean;
  refresh: () => Promise<void>;
  loadForWallet: (walletId: string) => Promise<Record[]>;
  getOne: (id: string) => Promise<Record | null>;
  create: (input: RecordInput) => Promise<Record>;
  createTransfer: (input: TransferInput) => Promise<{ out: Record; in: Record }>;
  update: (id: string, patch: Partial<Omit<RecordInput, 'walletId'>>) => Promise<Record | null>;
  remove: (id: string) => Promise<void>;
};

async function refreshWallets() {
  const { useWalletsStore } = await import('@/features/wallets/state/wallets.store');
  await useWalletsStore.getState().refresh();
}

export const useRecordsStore = create<RecordsStore>((set) => ({
  records: [],
  loadState: 'idle',
  error: null,
  loaded: false,

  refresh: async () => {
    set({ loadState: 'loading', error: null });
    try {
      const records = await listRecords();
      set({ records, loadState: 'ready', loaded: true });
    } catch (err) {
      set({ loadState: 'error', error: (err as Error).message, loaded: true });
    }
  },

  loadForWallet: async (walletId) => {
    return listRecordsByWallet(walletId);
  },

  getOne: async (id) => getRecord(id),

  create: async (input) => {
    const record = await createRecord(input);
    set((s) => ({ records: [record, ...s.records] }));
    void refreshWallets();
    return record;
  },

  createTransfer: async (input) => {
    const pair = await createTransfer(input);
    set((s) => ({ records: [pair.out, pair.in, ...s.records] }));
    void refreshWallets();
    return pair;
  },

  update: async (id, patch) => {
    const updated = await updateRecord(id, patch);
    if (updated) {
      set((s) => ({ records: s.records.map((r) => (r.id === id ? updated : r)) }));
      void refreshWallets();
    }
    return updated;
  },

  remove: async (id) => {
    await deleteRecord(id);
    set((s) => ({ records: s.records.filter((r) => r.id !== id) }));
    void refreshWallets();
  },
}));
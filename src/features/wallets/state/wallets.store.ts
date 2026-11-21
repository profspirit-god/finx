import { create } from 'zustand';
import type { Wallet, WalletInput } from '@/types/wallet';
import {
  archiveWallet,
  createWallet,
  deleteWallet,
  getWallet,
  listWallets,
  updateWallet,
} from '../api/wallets.repo';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

type WalletsStore = {
  wallets: Wallet[];
  loadState: LoadState;
  error: string | null;
  loaded: boolean;
  refresh: () => Promise<void>;
  refreshOne: (id: string) => Promise<Wallet | null>;
  create: (input: WalletInput) => Promise<Wallet>;
  update: (id: string, patch: Partial<WalletInput>) => Promise<Wallet | null>;
  archive: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export const useWalletsStore = create<WalletsStore>((set) => ({
  wallets: [],
  loadState: 'idle',
  error: null,
  loaded: false,

  refresh: async () => {
    set({ loadState: 'loading', error: null });
    try {
      const wallets = await listWallets(true);
      set({ wallets, loadState: 'ready', loaded: true });
    } catch (err) {
      set({ loadState: 'error', error: (err as Error).message, loaded: true });
    }
  },

  refreshOne: async (id) => {
    const wallet = await getWallet(id);
    if (wallet) {
      set((s) => ({
        wallets: s.wallets.some((w) => w.id === id)
          ? s.wallets.map((w) => (w.id === id ? wallet : w))
          : [...s.wallets, wallet],
      }));
    }
    return wallet;
  },

  create: async (input) => {
    const wallet = await createWallet(input);
    set((s) => ({ wallets: [wallet, ...s.wallets] }));
    return wallet;
  },

  update: async (id, patch) => {
    const updated = await updateWallet(id, patch);
    if (updated) {
      set((s) => ({ wallets: s.wallets.map((w) => (w.id === id ? updated : w)) }));
    }
    return updated;
  },

  archive: async (id) => {
    await archiveWallet(id);
    set((s) => ({
      wallets: s.wallets.map((w) => (w.id === id ? { ...w, archived: true } : w)),
    }));
  },

  remove: async (id) => {
    await deleteWallet(id);
    set((s) => ({ wallets: s.wallets.filter((w) => w.id !== id) }));
  },
}));
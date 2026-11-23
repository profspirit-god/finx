import { create } from 'zustand';
import { getDB } from '@/lib/db/idb';
import { NOTICES } from '../content';
import type { Notice, NoticeState } from '../types';

const STORE_ID = 'notices' as const;

type NoticesStore = {
  notices: Notice[];
  read: Set<string>;
  dismissed: Set<string>;
  loaded: boolean;
  load: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  dismiss: (id: string) => Promise<void>;
};

async function readState(): Promise<NoticeState> {
  const db = await getDB();
  const existing = await db.get('settings', STORE_ID as never);
  if (existing) return existing as unknown as NoticeState;
  const initial: NoticeState = { read: [], dismissed: [], lastCheckedAt: null };
  await db.put('settings', { ...initial, id: STORE_ID } as never);
  return initial;
}

async function writeState(state: NoticeState): Promise<void> {
  const db = await getDB();
  await db.put('settings', { ...state, id: STORE_ID } as never);
}

export const useNoticesStore = create<NoticesStore>((set, get) => ({
  notices: NOTICES,
  read: new Set(),
  dismissed: new Set(),
  loaded: false,

  load: async () => {
    const state = await readState();
    set({
      read: new Set(state.read),
      dismissed: new Set(state.dismissed),
      loaded: true,
    });
  },

  markRead: async (id) => {
    const state = await readState();
    if (state.read.includes(id)) return;
    const next: NoticeState = {
      ...state,
      read: [...state.read, id],
      lastCheckedAt: Date.now(),
    };
    await writeState(next);
    set({ read: new Set(next.read) });
  },

  markAllRead: async () => {
    const state = await readState();
    const allIds = get().notices.map((n) => n.id);
    const merged = Array.from(new Set([...state.read, ...allIds]));
    const next: NoticeState = {
      ...state,
      read: merged,
      lastCheckedAt: Date.now(),
    };
    await writeState(next);
    set({ read: new Set(next.read) });
  },

  dismiss: async (id) => {
    const notice = get().notices.find((n) => n.id === id);
    if (!notice || !notice.dismissable) return;
    const state = await readState();
    if (state.dismissed.includes(id)) return;
    const next: NoticeState = {
      ...state,
      dismissed: [...state.dismissed, id],
      read: state.read.includes(id) ? state.read : [...state.read, id],
      lastCheckedAt: Date.now(),
    };
    await writeState(next);
    set({ dismissed: new Set(next.dismissed), read: new Set(next.read) });
  },
}));
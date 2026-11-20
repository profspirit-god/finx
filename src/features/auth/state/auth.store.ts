import { create } from 'zustand';
import type { AuthState } from '../types';
import type { User } from '@/types/user';
import {
  createUser,
  deleteUser,
  getUser,
  updatePin,
  verifyPassword,
  verifyPin,
} from '../api/user.repo';
import type { PersonalizeInput } from '../types';
import { getDB } from '@/lib/db/idb';

const SESSION_KEY = 'finx_unlocked';

type AuthStore = {
  state: AuthState;
  initialize: () => Promise<void>;
  signup: (input: { displayName: string; password: string; pin: string }) => Promise<void>;
  unlock: (pin: string) => Promise<boolean>;
  lock: () => void;
  loginWithPassword: (password: string) => Promise<boolean>;
  completePersonalization: (input: PersonalizeInput) => Promise<void>
  changePin: (currentPin: string, newPin: string) => Promise<boolean>;
  reset: () => Promise<void>;
};

function setSessionUnlocked() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* ignore */
  }
}

function isSessionUnlocked(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  state: { status: 'loading' },

  initialize: async () => {
    const user = await getUser();
    if (!user) {
      set({ state: { status: 'needs-onboarding' } });
      return;
    }
    if (isSessionUnlocked()) {
      set({ state: { status: 'unlocked', user } });
    } else {
      set({ state: { status: 'locked', user } });
    }
  },

  signup: async (input) => {
    const user = await createUser(input);
    clearSession();
    set({ state: { status: 'locked', user } });
  },

  unlock: async (pin) => {
    const s = get().state;
    if (s.status !== 'locked') return false;
    const ok = await verifyPin(s.user, pin);
    if (ok) {
      setSessionUnlocked();
      set({ state: { status: 'unlocked', user: s.user } });
    }
    return ok;
  },

  lock: () => {
    clearSession();
    const s = get().state;
    if (s.status === 'unlocked') {
      set({ state: { status: 'locked', user: s.user } });
    }
  },

  loginWithPassword: async (password) => {
    const s = get().state;
    if (s.status !== 'locked' && s.status !== 'needs-onboarding') return false;
    const user = s.status === 'locked' ? s.user : await getUser();
    if (!user) return false;
    const ok = await verifyPassword(user, password);
    if (ok) {
      setSessionUnlocked();
      set({ state: { status: 'unlocked', user } });
    }
    return ok;
  },

  completePersonalization: async (input) => {
    const db = await getDB();
    const settings = await db.get('settings', 'settings');
    if (settings) {
      await db.put('settings', {
        ...settings,
        currency: input.primaryCurrency,
        updatedAt: Date.now(),
      });
    }
  },

  changePin: async (currentPin, newPin) => {
    const s = get().state;
    if (s.status !== 'unlocked') return false;
    const ok = await verifyPin(s.user, currentPin);
    if (!ok) return false;
    const updated = await updatePin(s.user, newPin);
    set({ state: { status: 'unlocked', user: updated } });
    return true;
  },

  reset: async () => {
    await deleteUser();
    clearSession();
    set({ state: { status: 'needs-onboarding' } });
  },
}));
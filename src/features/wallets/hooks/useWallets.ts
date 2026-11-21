import { useEffect } from 'react';
import { useWalletsStore } from '../state/wallets.store';

export function useWallets() {
  const store = useWalletsStore();
  useEffect(() => {
    if (!store.loaded && store.loadState === 'idle') {
      void store.refresh();
    }
  }, [store]);
  return store;
}
import { useEffect } from 'react';
import { useRecordsStore } from '../state/records.store';

export function useRecords() {
  const store = useRecordsStore();
  useEffect(() => {
    if (!store.loaded && store.loadState === 'idle') {
      void store.refresh();
    }
  }, [store]);
  return store;
}
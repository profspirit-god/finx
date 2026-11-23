import { useEffect } from 'react';
import { useNoticesStore } from '../state/notices.store';

export function useNotices() {
  const store = useNoticesStore();
  useEffect(() => {
    if (!store.loaded) void store.load();
  }, [store]);

  const visible = store.notices.filter((n) => !store.dismissed.has(n.id));
  const unread = visible.filter((n) => !store.read.has(n.id));

  return {
    ...store,
    visible,
    unread,
    unreadCount: unread.length,
  };
}
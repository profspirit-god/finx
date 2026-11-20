import { useEffect, useState } from 'react';

export default function OfflineBadge() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  if (online) return null;
  return (
    <span className="text-xs px-2 py-1 rounded-md bg-[var(--sys-orange)]/15 text-[var(--sys-orange)] border border-[var(--sys-orange)]/30">
      Offline
    </span>
  );
}
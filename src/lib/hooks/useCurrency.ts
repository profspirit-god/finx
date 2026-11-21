import { useEffect, useState } from 'react';
import { getDB } from '@/lib/db/idb';

let cached: string | null = null;

export function useCurrency(): string {
  const [currency, setCurrency] = useState<string>(cached ?? 'USD');

  useEffect(() => {
    if (cached) return;
    void (async () => {
      const db = await getDB();
      const s = await db.get('settings', 'settings');
      cached = s?.currency ?? 'USD';
      setCurrency(cached);
    })();
  }, []);

  return currency;
}

export function invalidateCurrencyCache(): void {
  cached = null;
}
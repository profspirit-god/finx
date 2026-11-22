import { useEffect, useState } from 'react';
import { getDB } from '@/lib/db/idb';

type Stats = {
  version: string;
  wallets: number;
  records: number;
  receipts: number;
  storageUsed: string;
  storageQuota: string;
};

export default function LocalStatsCard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    void (async () => {
      const db = await getDB();
      const [wallets, records, receipts] = await Promise.all([
        db.count('wallets'),
        db.count('records'),
        db.count('receipts'),
      ]);

      let used = '—';
      let quota = '—';
      if (typeof navigator !== 'undefined' && navigator.storage?.estimate) {
        const est = await navigator.storage.estimate();
        if (est.usage !== undefined) used = formatBytes(est.usage);
        if (est.quota !== undefined) quota = formatBytes(est.quota);
      }

      setStats({
        version: '1.6.0.0',
        wallets,
        records,
        receipts,
        storageUsed: used,
        storageQuota: quota,
      });
    })();
  }, []);

  if (!stats) {
    return (
      <div className="glass p-4 text-sm text-dim">Loading local stats…</div>
    );
  }

  return (
    <div className="glass p-4 space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-dim">App version</span>
        <span className="font-mono">{stats.version}</span>
      </div>
      <div className="divider" />
      <div className="flex items-center justify-between">
        <span className="text-dim">Local wallets</span>
        <span className="font-mono">{stats.wallets}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-dim">Local records</span>
        <span className="font-mono">{stats.records}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-dim">Local receipts</span>
        <span className="font-mono">{stats.receipts}</span>
      </div>
      <div className="divider" />
      <div className="flex items-center justify-between">
        <span className="text-dim">Storage used</span>
        <span className="font-mono">{stats.storageUsed}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-dim">Storage quota</span>
        <span className="font-mono">{stats.storageQuota}</span>
      </div>
      <p className="text-[11px] text-mute pt-2">
        These stats describe this browser only — not other users.
      </p>
    </div>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
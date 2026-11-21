import { FileText, Shield, AlertTriangle } from 'lucide-react';
import { Notice } from '@/ui';
import type { FinXBackup } from '../lib/schema';
import { formatDateTime } from '@/lib/format/date';

type Props = { backup: FinXBackup; mode: 'replace' | 'merge' };

export default function BackupPreview({ backup, mode }: Props) {
  return (
    <div className="space-y-3">
      <div className="glass p-3 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-gold-400/15 flex items-center justify-center shrink-0">
          <FileText size={18} strokeWidth={1.75} className="text-gold-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">FinX backup file</p>
          <p className="text-xs text-mute">Exported {formatDateTime(backup.exportedAt)} · version {backup.version}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
        <Stat label="Users" value={backup.users.length} />
        <Stat label="Wallets" value={backup.wallets.length} />
        <Stat label="Records" value={backup.records.length} />
        <Stat label="Receipts" value={backup.receipts.length} />
        <Stat label="Settings" value={backup.settings.length} />
      </div>

      {mode === 'replace' ? (
        <Notice variant="warning" title="Replace everything">
          All current users, wallets, records, and receipts will be deleted before the backup is written. This cannot be undone.
        </Notice>
      ) : (
        <Notice variant="info" title="Merge with current data">
          Existing items with the same ID are overwritten. New items are added. Nothing is deleted.
        </Notice>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass p-2 text-center">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-[11px] text-mute">{label}</p>
    </div>
  );
}
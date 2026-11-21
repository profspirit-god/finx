import { useState } from 'react';
import { Upload, AlertTriangle } from 'lucide-react';
import { Button, Dialog, Notice, useToast } from '@/ui';
import BackupPreview from './BackupPreview';
import { parseBackupFile, writeBackup } from '../lib/import';
import type { FinXBackup } from '../lib/schema';

type Mode = 'merge' | 'replace';

export default function ImportPanel() {
  const toast = useToast();
  const [backup, setBackup] = useState<FinXBackup | null>(null);
  const [mode, setMode] = useState<Mode>('merge');
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmReplace, setConfirmReplace] = useState(false);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setParsing(true);
    try {
      const parsed = await parseBackupFile(file);
      setBackup(parsed);
    } catch (err) {
      setError((err as Error).message);
      setBackup(null);
    } finally {
      setParsing(false);
    }
  };

  const executeImport = async () => {
    if (!backup) return;
    setConfirmReplace(false);
    setImporting(true);
    try {
      const result = await writeBackup(backup, mode);
      toast.push({
        variant: 'success',
        title: 'Import complete',
        message: `Wallets: ${result.wallets}, records: ${result.records}, receipts: ${result.receipts}.`,
      });
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      setImporting(false);
      toast.push({
        variant: 'error',
        title: 'Import failed',
        message: (err as Error).message || 'The backup file may be corrupt.',
      });
    }
  };

  const runImport = () => {
    if (!backup) return;
    if (mode === 'replace') {
      setConfirmReplace(true);
    } else {
      void executeImport();
    }
  };

  return (
    <div className="glass-strong p-5 space-y-5">
      <div>
        <h2 className="text-base font-semibold">Import backup</h2>
        <p className="text-sm text-dim mt-1">
          Restore a full FinX backup file. All data stays on this device.
        </p>
      </div>

      {error && <Notice variant="error" title="Could not read file">{error}</Notice>}

      {!backup && (
        <label className="flex flex-col items-center justify-center gap-2 p-8 rounded-2xl border border-dashed border-[var(--line)] cursor-pointer hover:bg-white/[0.03] transition-colors">
          <Upload size={22} strokeWidth={1.75} className="text-gold-400" />
          <p className="text-sm font-medium">Choose a backup file</p>
          <p className="text-xs text-mute">.json export from FinX Data Tools</p>
          <input
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            disabled={parsing}
          />
        </label>
      )}

      {parsing && (
        <Notice variant="info" title="Reading file…">
          Validating backup format.
        </Notice>
      )}

      {backup && (
        <>
          <BackupPreview backup={backup} mode={mode} />

          <div>
            <label className="block text-xs font-medium text-dim mb-2">Import mode</label>
            <div className="flex flex-col gap-2">
              <ModeOption
                value="merge"
                selected={mode === 'merge'}
                onSelect={() => setMode('merge')}
                title="Merge with current data"
                description="Keep existing wallets and records. Add new ones from the backup. Existing IDs are overwritten."
              />
              <ModeOption
                value="replace"
                selected={mode === 'replace'}
                onSelect={() => setMode('replace')}
                title="Replace all data"
                description="Delete everything currently stored, then restore from backup. Use after resetting the app."
                danger
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setBackup(null)} disabled={importing}>
              Choose different file
            </Button>
            <Button
              variant={mode === 'replace' ? 'danger' : 'primary'}
              onClick={runImport}
              loading={importing}
            >
              {importing ? 'Importing…' : mode === 'replace' ? 'Replace and import' : 'Merge into my data'}
            </Button>
          </div>
        </>
      )}

      <Dialog
        open={confirmReplace}
        onClose={() => setConfirmReplace(false)}
        title="Replace all data?"
        description="Every wallet, record, receipt, and setting currently on this device will be permanently deleted, then the backup will be restored."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmReplace(false)}>Cancel</Button>
            <Button variant="danger" onClick={executeImport} loading={importing}>
              {importing ? 'Replacing…' : 'Yes, replace everything'}
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--sys-red)]/15 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} strokeWidth={1.75} className="text-[var(--sys-red)]" />
          </div>
          <p className="text-sm text-dim">
            This cannot be undone. Consider exporting a full backup first from the Export tab.
          </p>
        </div>
      </Dialog>
    </div>
  );
}

function ModeOption({
  selected,
  onSelect,
  title,
  description,
  danger,
}: {
  value: string;
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'text-left p-3 rounded-xl border transition-colors',
        selected
          ? danger
            ? 'border-[var(--sys-red)] bg-[var(--sys-red)]/10'
            : 'border-gold-400 bg-gold-400/10'
          : 'border-[var(--line)] glass hover:bg-white/[0.05]',
      ].join(' ')}
    >
      <div className="flex items-center gap-2">
        {danger && <AlertTriangle size={14} strokeWidth={2} className="text-[var(--sys-red)]" />}
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="text-xs text-mute mt-1">{description}</p>
    </button>
  );
}
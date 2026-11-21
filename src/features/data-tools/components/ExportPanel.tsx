import { useMemo, useState } from 'react';
import { Download, Shield } from 'lucide-react';
import { Button, Input, Notice, Select, Switch, useToast } from '@/ui';
import { useWallets } from '@/features/wallets/hooks/useWallets';
import { useRecords } from '@/features/records/hooks/useRecords';
import FormatPicker from './FormatPicker';
import FieldPicker from './FieldPicker';
import {
  defaultFilename,
  downloadBlob,
  filterRecords,
  toCSV,
  toJSON,
  toPDF,
  toXLSX,
} from '../lib/export';
import { RECORD_FIELDS, type ExportFormat, type ExportOptions, type RecordField } from '../lib/schema';
import { exportFullBackup, updateBackupStamp } from '../lib/import';

export default function ExportPanel() {
  const toast = useToast();
  const { wallets } = useWallets();
  const { records } = useRecords();

  const activeWallets = wallets.filter((w) => !w.archived);
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [fields, setFields] = useState<RecordField[]>(
    RECORD_FIELDS.filter((f) => f.default).map((f) => f.key),
  );
  const [walletId, setWalletId] = useState<string>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [includeArchived, setIncludeArchived] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [backingUp, setBackingUp] = useState(false);

  const opts: ExportOptions = useMemo(
    () => ({
      format,
      fields,
      walletIds: walletId === 'all' ? 'all' : [walletId],
      from: fromDate ? new Date(fromDate).getTime() : null,
      to: toDate ? new Date(toDate).getTime() + 86_400_000 - 1 : null,
      includeArchived,
    }),
    [format, fields, walletId, fromDate, toDate, includeArchived],
  );

  const count = useMemo(() => filterRecords(records, wallets, opts).length, [records, wallets, opts]);

  const runFullBackup = async () => {
    setBackingUp(true);
    try {
      const backup = await exportFullBackup();
      const json = JSON.stringify(backup, null, 2);
      const ts = new Date().toISOString().slice(0, 10);
      downloadBlob(new Blob([json], { type: 'application/json' }), `finx-backup-${ts}.json`);
      await updateBackupStamp();
      toast.push({
        variant: 'success',
        title: 'Full backup ready',
        message: `${backup.wallets.length} wallets, ${backup.records.length} records, ${backup.receipts.length} receipts.`,
      });
    } catch (err) {
      toast.push({
        variant: 'error',
        title: 'Backup failed',
        message: (err as Error).message || 'Try again.',
      });
    } finally {
      setBackingUp(false);
    }
  };

  const runExport = async () => {
    if (fields.length === 0) {
      toast.push({ variant: 'error', title: 'No fields selected', message: 'Pick at least one field to export.' });
      return;
    }
    if (count === 0) {
      toast.push({ variant: 'warning', title: 'Nothing to export', message: 'No records match these filters.' });
      return;
    }
    setExporting(true);
    try {
      const filtered = filterRecords(records, wallets, opts);
      const currency = activeWallets[0]?.currency ?? 'USD';
      let blob: Blob;
      let filename: string;
      if (format === 'csv') {
        blob = new Blob([toCSV(filtered, wallets, fields)], { type: 'text/csv;charset=utf-8' });
        filename = defaultFilename('csv');
      } else if (format === 'json') {
        blob = new Blob([toJSON(filtered, wallets, fields)], { type: 'application/json' });
        filename = defaultFilename('json');
      } else if (format === 'xlsx') {
        blob = toXLSX(filtered, wallets, fields);
        filename = defaultFilename('xlsx');
      } else {
        blob = toPDF(filtered, wallets, fields, { currency });
        filename = defaultFilename('pdf');
      }
      downloadBlob(blob, filename);
      await updateBackupStamp();
      toast.push({
        variant: 'success',
        title: 'Export ready',
        message: `${count} records exported as ${format.toUpperCase()}.`,
      });
    } catch (err) {
      toast.push({
        variant: 'error',
        title: 'Export failed',
        message: (err as Error).message || 'Try again or choose a different format.',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* FULL BACKUP — distinct, prominent, for restore-anywhere */}
      <div className="glass-strong p-5 space-y-3 border border-gold-line">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-gold-400/15 flex items-center justify-center shrink-0">
            <Shield size={18} strokeWidth={1.75} className="text-gold-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold">Full backup (restore-anywhere)</h2>
            <p className="text-sm text-dim mt-1">
              One JSON file with all wallets, records, receipts, and settings. Use this to move FinX to another device
              or restore after a reset. This is the file that Import accepts.
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={runFullBackup} loading={backingUp} leftIcon={<Download size={16} strokeWidth={2} />}>
            {backingUp ? 'Preparing…' : 'Download full backup'}
          </Button>
        </div>
      </div>

      {/* RECORD EXPORT — table-friendly output for analysis */}
      <div className="glass-strong p-5 space-y-5">
        <div>
          <h2 className="text-base font-semibold">Export records</h2>
          <p className="text-sm text-dim mt-1">
            Download a table of your records in CSV, JSON, XLSX, or PDF — for spreadsheets or analysis.
            This is not a backup file — it cannot be imported back.
          </p>
        </div>

        <FormatPicker value={format} onChange={setFormat} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Wallet"
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
            options={[
              { value: 'all', label: 'All wallets' },
              ...activeWallets.map((w) => ({ value: w.id, label: w.name })),
            ]}
          />
          <Input label="From" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <Input label="To" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>

        <Switch
          checked={includeArchived}
          onChange={setIncludeArchived}
          label="Include archived wallets"
          hint="Off by default — archived wallets are hidden."
        />

        <FieldPicker value={fields} onChange={setFields} />

        <Notice variant="info" title={`${count} record${count === 1 ? '' : 's'} will be exported`}>
          Export also updates your last-backup timestamp in Settings.
        </Notice>

        <div className="flex justify-end">
          <Button onClick={runExport} loading={exporting} leftIcon={<Download size={16} strokeWidth={2} />}>
            {exporting ? 'Exporting…' : `Export ${format.toUpperCase()}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
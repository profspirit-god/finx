import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import type { Wallet } from '@/types/wallet';
import type { Record } from '@/types/record';
import { RECORD_CLASS_LABELS } from '@/types/record';
import type { ExportOptions, RecordField } from './schema';
import { formatDateTime } from '@/lib/format/date';
import { formatMinor } from '@/lib/format/currency';

/** Builds a 2D array of [header, ...rows] from records using chosen fields. */
export function buildTabular(
  records: Record[],
  wallets: Wallet[],
  fields: RecordField[],
): { headers: string[]; rows: (string | number)[][] } {
  const walletById = new Map(wallets.map((w) => [w.id, w]));
  const headers = fields.map((f) => humanField(f));

  const rows = records.map((r) => {
    const w = walletById.get(r.walletId);
    return fields.map((f) => {
      switch (f) {
        case 'id': return r.id;
        case 'walletId': return r.walletId;
        case 'walletName': return w?.name ?? '';
        case 'amountMinor': return r.amountMinor / 100;
        case 'class': return RECORD_CLASS_LABELS[r.class];
        case 'counterparty': return r.counterparty;
        case 'note': return r.note;
        case 'tags': return r.tags.join(', ');
        case 'occurredAt': return formatDateTime(r.occurredAt);
        case 'createdAt': return formatDateTime(r.createdAt);
        case 'transferPairId': return r.transferPairId ?? '';
        case 'receiptId': return r.receiptId ?? '';
      }
    });
  });
  return { headers, rows };
}

function humanField(f: RecordField): string {
  return f
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .replace(' Id', ' ID');
}

export function filterRecords(
  records: Record[],
  wallets: Wallet[],
  opts: ExportOptions,
): Record[] {
  const walletSet = opts.walletIds === 'all' ? null : new Set(opts.walletIds);
  return records.filter((r) => {
    if (r.deletedAt !== null) return false;
    if (walletSet && !walletSet.has(r.walletId)) return false;
    if (!opts.includeArchived) {
      const w = wallets.find((x) => x.id === r.walletId);
      if (w?.archived) return false;
    }
    if (opts.from !== null && r.occurredAt < opts.from) return false;
    if (opts.to !== null && r.occurredAt > opts.to) return false;
    return true;
  });
}

export function toCSV(
  records: Record[],
  wallets: Wallet[],
  fields: RecordField[],
): string {
  const { headers, rows } = buildTabular(records, wallets, fields);
  return Papa.unparse({ fields: headers, data: rows });
}

export function toJSON(
  records: Record[],
  wallets: Wallet[],
  fields: RecordField[],
): string {
  const { headers, rows } = buildTabular(records, wallets, fields);
  const objects = rows.map((row) => Object.fromEntries(row.map((v, i) => [headers[i], v])));
  return JSON.stringify(objects, null, 2);
}

export function toXLSX(
  records: Record[],
  wallets: Wallet[],
  fields: RecordField[],
): Blob {
  const { headers, rows } = buildTabular(records, wallets, fields);
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Records');
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  return new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export function toPDF(
  records: Record[],
  wallets: Wallet[],
  fields: RecordField[],
  opts: { currency: string; title?: string } = { currency: 'USD' },
): Blob {
  const { headers, rows } = buildTabular(records, wallets, fields);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const marginX = 32;
  let y = 48;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(opts.title ?? 'FinX Records Export', marginX, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Generated ${formatDateTime(Date.now())} — ${records.length} records`, marginX, y);
  y += 16;

  // Simple table layout: truncate columns to fit page width
  const pageWidth = doc.internal.pageSize.getWidth();
  const usable = pageWidth - marginX * 2;
  const colW = usable / headers.length;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  headers.forEach((h, i) => doc.text(trunc(h, 20), marginX + i * colW, y));
  y += 12;
  doc.setDrawColor(200);
  doc.line(marginX, y - 6, pageWidth - marginX, y - 6);

  doc.setFont('helvetica', 'normal');
  for (const row of rows) {
    if (y > doc.internal.pageSize.getHeight() - 32) {
      doc.addPage();
      y = 48;
    }
    row.forEach((cell, i) => {
      const str =
        typeof cell === 'number'
          ? formatMinor(Math.round(cell * 100), opts.currency)
          : trunc(String(cell), 24);
      doc.text(str, marginX + i * colW, y);
    });
    y += 12;
  }
  return doc.output('blob');
}

function trunc(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function defaultFilename(fmt: 'csv' | 'json' | 'xlsx' | 'pdf'): string {
  const ts = new Date().toISOString().slice(0, 10);
  return `finx-records-${ts}.${fmt}`;
}
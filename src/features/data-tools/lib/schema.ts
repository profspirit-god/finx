import type { User } from '@/types/user';
import type { Wallet } from '@/types/wallet';
import type { Record } from '@/types/record';
import type { Settings } from '@/types/settings';
import type { StoredReceipt } from '@/lib/db/schema';

export const BACKUP_VERSION = 1 as const;

export type FinXBackup = {
  app: 'FinX';
  version: typeof BACKUP_VERSION;
  exportedAt: number;
  users: User[];
  settings: Settings[];
  wallets: Wallet[];
  records: Record[];
  receipts: SerializedReceipt[];
};

/** Base64-encoded receipt for JSON-safety. */
export type SerializedReceipt = {
  id: string;
  recordId: string;
  mimeType: string;
  fileName: string;
  createdAt: number;
  dataBase64: string;
};

export type RecordField =
  | 'id'
  | 'walletId'
  | 'walletName'
  | 'amountMinor'
  | 'class'
  | 'counterparty'
  | 'note'
  | 'tags'
  | 'occurredAt'
  | 'createdAt'
  | 'transferPairId'
  | 'receiptId';

export type RecordFieldMeta = {
  key: RecordField;
  label: string;
  default: boolean;
};

export const RECORD_FIELDS: RecordFieldMeta[] = [
  { key: 'occurredAt',    label: 'Date',           default: true },
  { key: 'class',         label: 'Class',          default: true },
  { key: 'walletName',    label: 'Wallet',         default: true },
  { key: 'amountMinor',   label: 'Amount',         default: true },
  { key: 'counterparty',  label: 'Counterparty',   default: true },
  { key: 'note',          label: 'Note',           default: true },
  { key: 'tags',          label: 'Tags',           default: false },
  { key: 'walletId',      label: 'Wallet ID',      default: false },
  { key: 'id',            label: 'Record ID',      default: false },
  { key: 'transferPairId',label: 'Transfer pair',  default: false },
  { key: 'receiptId',     label: 'Receipt ID',     default: false },
  { key: 'createdAt',     label: 'Created at',     default: false },
];

export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf';

export type ExportOptions = {
  format: ExportFormat;
  fields: RecordField[];
  walletIds: string[] | 'all';
  from: number | null;
  to: number | null;
  includeArchived: boolean;
};
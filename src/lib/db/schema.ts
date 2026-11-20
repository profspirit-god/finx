import type { User } from '@/types/user';
import type { Wallet } from '@/types/wallet';
import type { Record } from '@/types/record';
import type { Settings } from '@/types/settings';
import type { DBSchema } from 'idb';

export type StoredReceipt = {
  id: string;
  recordId: string;
  blob: Blob;
  mimeType: string;
  fileName: string;
  createdAt: number;
};

export interface FinXDB extends DBSchema {
  users: {
    key: string;
    value: User;
  };
  settings: {
    key: string;
    value: Settings;
  };
  wallets: {
    key: string;
    value: Wallet;
    indexes: { 'by-updated': number; 'by-type': string };
  };
  records: {
    key: string;
    value: Record;
    indexes: { 'by-wallet': string; 'by-created': number; 'by-occurred': number };
  };
  receipts: {
    key: string;
    value: StoredReceipt;
    indexes: { 'by-record': string };
  };
}

export const DB_NAME = 'finx';
export const DB_VERSION = 1;
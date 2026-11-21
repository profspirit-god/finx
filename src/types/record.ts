export type CashflowClass =
  | 'income'
  | 'expense'
  | 'transfer'
  | 'adjustment';

export type Record = {
  id: string;
  walletId: string;
  amountMinor: number;
  class: CashflowClass;
  counterparty: string;
  note: string;
  tags: string[];
  receiptId: string | null;
  transferPairId: string | null;
  occurredAt: number;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
};

export type RecordInput = {
  walletId: string;
  amountMinor: number;
  class: CashflowClass;
  counterparty: string;
  note: string;
  tags: string[];
  receiptId: string | null;
  occurredAt: number;
};

export type TransferInput = {
  fromWalletId: string;
  toWalletId: string;
  amountMinor: number;
  counterparty: string;
  note: string;
  occurredAt: number;
};

type ClassLabels = {
  income: string;
  expense: string;
  transfer: string;
  adjustment: string;
};

type ClassTones = {
  income: 'green';
  expense: 'red';
  transfer: 'blue';
  adjustment: 'orange';
};

export const RECORD_CLASS_LABELS: ClassLabels = {
  income: 'Income',
  expense: 'Expense',
  transfer: 'Transfer',
  adjustment: 'Adjustment',
};

export const RECORD_CLASS_TONES: ClassTones = {
  income: 'green',
  expense: 'red',
  transfer: 'blue',
  adjustment: 'orange',
};

/**
 * Sign convention for `amountMinor` on balance:
 *   income     → +
 *   expense    → -
 *   adjustment → +/- (positive adds, negative removes)
 *   transfer   → handled as a pair: source wallet = -, destination wallet = +
 *
 * A record's stored `amountMinor` is always a positive number. The class
 * determines the direction. Transfers use `transferPairId` to link the two
 * records; the "from" record has a matching "to" record with the same pairId.
 */
export function signedDelta(r: Pick<Record, 'class' | 'amountMinor' | 'transferPairId'>): number {
  if (r.class === 'income') return r.amountMinor;
  if (r.class === 'expense') return -r.amountMinor;
  if (r.class === 'adjustment') return r.amountMinor;
  // transfer: caller decides direction using transferPairId
  return 0;
}
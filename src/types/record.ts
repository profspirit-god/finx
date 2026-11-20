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
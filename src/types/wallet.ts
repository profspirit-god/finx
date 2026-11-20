export type WalletType =
  | 'cash'
  | 'bank'
  | 'e-wallet'
  | 'investment'
  | 'other';

export type Wallet = {
  id: string;
  name: string;
  description: string;
  type: WalletType;
  currency: string;
  startingBalanceMinor: number;
  currentBalanceMinor: number;
  color: string;
  iconKey: string | null;
  targetAmountMinor: number | null;
  targetDate: number | null;
  archived: boolean;
  createdAt: number;
  updatedAt: number;
};
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

export type WalletInput = {
  name: string;
  description: string;
  type: WalletType;
  currency: string;
  startingBalanceMinor: number;
  color: string;
  iconKey?: string | null;
  targetAmountMinor?: number | null;
  targetDate?: number | null;
};

export const WALLET_TYPE_LABELS: Record<WalletType, string> = {
  cash: 'Cash',
  bank: 'Bank',
  'e-wallet': 'E-Wallet',
  investment: 'Investment',
  other: 'Other',
};

export const WALLET_TYPE_ICONS: Record<WalletType, string> = {
  cash: 'Banknote',
  bank: 'Building2',
  'e-wallet': 'Smartphone',
  investment: 'TrendingUp',
  other: 'Wallet',
};
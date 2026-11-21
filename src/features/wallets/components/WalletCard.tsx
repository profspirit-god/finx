import { Link } from 'react-router-dom';
import { Banknote, Building2, Smartphone, TrendingUp, Wallet as WalletIcon, ArrowUpRight } from 'lucide-react';
import type { Wallet, WalletType } from '@/types/wallet';
import { formatMinor } from '@/lib/format/currency';

const ICONS: Record<WalletType, typeof WalletIcon> = {
  cash: Banknote,
  bank: Building2,
  'e-wallet': Smartphone,
  investment: TrendingUp,
  other: WalletIcon,
};

export default function WalletCard({ wallet }: { wallet: Wallet }) {
  const Icon = ICONS[wallet.type];
  return (
    <Link
      to={`/wallets/${wallet.id}`}
      className="glass p-4 flex flex-col gap-3 hover:bg-white/[0.06] transition-colors group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${wallet.color}22`, border: `1px solid ${wallet.color}55` }}
          >
            <Icon size={18} strokeWidth={1.75} style={{ color: wallet.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{wallet.name}</p>
            <p className="text-xs text-mute truncate">{wallet.description || '—'}</p>
          </div>
        </div>
        <ArrowUpRight
          size={16}
          strokeWidth={1.75}
          className="text-dim group-hover:text-gold-400 transition-colors shrink-0"
        />
      </div>
      <div>
        <p className="text-xs text-mute">Balance</p>
        <p className="text-lg font-semibold text-white">
          {formatMinor(wallet.currentBalanceMinor, wallet.currency)}
        </p>
      </div>
      {wallet.targetAmountMinor !== null && wallet.targetAmountMinor > 0 && (
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-dim">Goal</span>
            <span className="text-gold-400 font-medium">
              {Math.min(100, Math.round((wallet.currentBalanceMinor / wallet.targetAmountMinor) * 100))}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gold-400 rounded-full"
              style={{
                width: `${Math.min(100, (wallet.currentBalanceMinor / wallet.targetAmountMinor) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </Link>
  );
}
import { ProgressBar } from '@/ui';
import { formatMinor } from '@/lib/format/currency';
import { formatDate } from '@/lib/format/date';
import type { Wallet } from '@/types/wallet';

export default function WalletGoalBar({ wallet }: { wallet: Wallet }) {
  if (wallet.targetAmountMinor === null || wallet.targetAmountMinor <= 0) return null;

  const current = Math.max(0, wallet.currentBalanceMinor);
  const target = wallet.targetAmountMinor;
  const pct = Math.min(100, (current / target) * 100);

  return (
    <div className="glass p-4 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-mute">Savings goal</p>
          <p className="text-sm font-semibold text-white">
            {formatMinor(current, wallet.currency)} / {formatMinor(target, wallet.currency)}
          </p>
        </div>
        {wallet.targetDate !== null && (
          <div className="text-right">
            <p className="text-xs text-mute">Target date</p>
            <p className="text-sm text-white">{formatDate(wallet.targetDate)}</p>
          </div>
        )}
      </div>
      <ProgressBar value={pct} showPercent />
    </div>
  );
}
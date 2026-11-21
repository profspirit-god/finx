import { Button } from '@/ui';
import { formatMinor } from '@/lib/format/currency';
import { formatDate } from '@/lib/format/date';
import { WALLET_TYPE_LABELS } from '@/types/wallet';
import type { WalletInput } from '@/types/wallet';
import { useCurrency } from '@/lib/hooks/useCurrency';

type Props = {
  draft: {
    name: string;
    description: string;
    type: WalletInput['type'];
    color: string;
    startingBalanceMinor: number;
    targetAmountMinor: number | null;
    targetDate: number | null;
  };
  saving: boolean;
  onBack: () => void;
  onCreate: () => void;
};

export default function StepReview({ draft, saving, onBack, onCreate }: Props) {
  const currency = useCurrency();
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Review</h2>
        <p className="text-sm text-dim mt-1">Looks good? Create it, or go back to change anything.</p>
      </div>

      <div className="space-y-3 text-sm">
        <Row label="Name" value={draft.name} />
        <Row label="Type" value={WALLET_TYPE_LABELS[draft.type]} />
        <Row label="Description" value={draft.description || '—'} />
        <Row label="Starting balance" value={formatMinor(draft.startingBalanceMinor, currency)} />
        {draft.targetAmountMinor !== null && (
          <>
            <Row label="Goal amount" value={formatMinor(draft.targetAmountMinor, currency)} />
            {draft.targetDate !== null && (
              <Row label="Goal date" value={formatDate(draft.targetDate)} />
            )}
          </>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="text-dim">Accent color</span>
          <span className="w-6 h-6 rounded-full" style={{ background: draft.color }} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack} disabled={saving}>Back</Button>
        <Button onClick={onCreate} loading={saving}>
          {saving ? 'Creating…' : 'Create wallet'}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-dim">{label}</span>
      <span className="text-white text-right truncate max-w-[60%]">{value}</span>
    </div>
  );
}
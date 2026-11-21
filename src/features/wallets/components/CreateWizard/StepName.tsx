import { useState } from 'react';
import { Button, Input, Select } from '@/ui';
import { WALLET_TYPE_LABELS, type WalletInput, type WalletType } from '@/types/wallet';
import type { WizardDraft } from './WizardShell';

const WALLET_TYPES = (['cash', 'bank', 'e-wallet', 'investment', 'other'] as WalletType[]).map(
  (t) => ({ value: t, label: WALLET_TYPE_LABELS[t] }),
);

const COLORS = ['#F5B800', '#5CA8FF', '#4ADE80', '#FF9F45', '#FF5C5C', '#A78BFA'];

type Props = {
  draft: WizardDraft;
  onChange: (patch: Partial<WizardDraft>) => void;
  onNext: () => void;
};

export default function StepName({ draft, onChange, onNext }: Props) {
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (draft.name.trim().length < 2) return setError('Name must be at least 2 characters.');
    setError(null);
    onChange({ name: draft.name.trim() });
    onNext();
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Name your wallet</h2>
        <p className="text-sm text-dim mt-1">Something you'll recognize at a glance.</p>
      </div>

      <Input
        label="Wallet name"
        placeholder="e.g. Cash on hand, BPI Savings, GCash"
        value={draft.name}
        onChange={(e) => onChange({ name: e.target.value })}
        error={error ?? undefined}
        autoFocus
      />

      <Select
        label="Wallet type"
        value={draft.type}
        onChange={(e) => onChange({ type: e.target.value as WalletInput['type'] })}
        options={WALLET_TYPES}
      />

      <div>
        <label className="block text-xs font-medium text-dim mb-2">Accent color</label>
        <div className="flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange({ color: c })}
              aria-label={`Pick color ${c}`}
              className={[
                'w-8 h-8 rounded-full transition-transform',
                draft.color === c ? 'ring-2 ring-offset-2 ring-offset-[var(--bg)] scale-110' : '',
              ].join(' ')}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={submit}>Next</Button>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Button, Input, Select } from '@/ui';
import type { WalletInput, WalletType } from '@/types/wallet';
import { WALLET_TYPE_LABELS } from '@/types/wallet';

const WALLET_TYPES = (['cash', 'bank', 'e-wallet', 'investment', 'other'] as WalletType[]).map(
  (t) => ({ value: t, label: WALLET_TYPE_LABELS[t] }),
);

const COLORS = ['#F5B800', '#5CA8FF', '#4ADE80', '#FF9F45', '#FF5C5C', '#A78BFA'];

type Props = {
  initial: { name: string; type: WalletInput['type']; color: string };
  onNext: (patch: { name: string; type: WalletInput['type']; color: string }) => void;
};

export default function StepName({ initial, onNext }: Props) {
  const [name, setName] = useState(initial.name);
  const [type, setType] = useState<WalletInput['type']>(initial.type);
  const [color, setColor] = useState(initial.color);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (name.trim().length < 2) return setError('Name must be at least 2 characters.');
    setError(null);
    onNext({ name: name.trim(), type, color });
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
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error ?? undefined}
        autoFocus
      />

      <Select
        label="Wallet type"
        value={type}
        onChange={(e) => setType(e.target.value as WalletInput['type'])}
        options={WALLET_TYPES}
      />

      <div>
        <label className="block text-xs font-medium text-dim mb-2">Accent color</label>
        <div className="flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={`Pick color ${c}`}
              className={[
                'w-8 h-8 rounded-full transition-transform',
                color === c ? 'ring-2 ring-offset-2 ring-offset-[var(--bg)] scale-110' : '',
              ].join(' ')}
              style={{ background: c, boxShadow: color === c ? `0 0 0 2px ${c}` : undefined }}
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
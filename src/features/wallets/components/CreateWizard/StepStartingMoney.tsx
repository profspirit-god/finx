import { useState } from 'react';
import { Button, Input } from '@/ui';
import { formatMinor, parseToMinor } from '@/lib/format/currency';
import type { WizardDraft } from './WizardShell';

type Props = {
  draft: WizardDraft;
  onChange: (patch: Partial<WizardDraft>) => void;
  onNext: () => void;
};

export default function StepStartingMoney({ draft, onChange, onNext }: Props) {
  const [error, setError] = useState<string | null>(null);
  const raw = draft.startingBalanceMinor > 0 ? (draft.startingBalanceMinor / 100).toString() : '';
  const parsed = parseToMinor(raw) ?? 0;

  const submit = () => {
    if (parsed < 0) return setError('Enter a valid non-negative amount.');
    setError(null);
    onNext();
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Starting balance</h2>
        <p className="text-sm text-dim mt-1">
          How much is in this wallet right now? You can change it later.
        </p>
      </div>

      <Input
        label="Amount"
        placeholder="0.00"
        value={raw}
        onChange={(e) => {
          const p = parseToMinor(e.target.value) ?? 0;
          onChange({ startingBalanceMinor: p });
        }}
        inputMode="decimal"
        error={error ?? undefined}
        hint={parsed > 0 ? `You'll start at ${formatMinor(parsed, 'USD')}` : 'Enter 0 if this wallet is empty.'}
        autoFocus
      />

      <div className="flex justify-end pt-2">
        <Button onClick={submit}>Next</Button>
      </div>
    </div>
  );
}
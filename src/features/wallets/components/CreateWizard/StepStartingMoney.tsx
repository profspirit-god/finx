import { useState } from 'react';
import { Button, Input } from '@/ui';
import { formatMinor, parseToMinor } from '@/lib/format/currency';

type Props = {
  initial: { startingBalanceMinor: number };
  saving: boolean;
  onBack: () => void;
  onSave: (patch: { startingBalanceMinor: number }) => void;
};

export default function StepStartingMoney({ initial, saving, onBack, onSave }: Props) {
  const [raw, setRaw] = useState(
    initial.startingBalanceMinor > 0 ? (initial.startingBalanceMinor / 100).toString() : '',
  );
  const [error, setError] = useState<string | null>(null);

  const parsed = raw === '' ? 0 : parseToMinor(raw);

  const submit = () => {
    if (parsed === null || parsed < 0) return setError('Enter a valid non-negative amount.');
    setError(null);
    onSave({ startingBalanceMinor: parsed });
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
        onChange={(e) => setRaw(e.target.value)}
        inputMode="decimal"
        error={error ?? undefined}
        hint={parsed !== null && parsed > 0 ? `You'll start at ${formatMinor(parsed, 'USD')}` : 'Enter 0 if this wallet is empty.'}
        autoFocus
      />

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack} disabled={saving}>Back</Button>
        <Button onClick={submit} loading={saving}>
          {saving ? 'Creating…' : 'Create wallet'}
        </Button>
      </div>
    </div>
  );
}
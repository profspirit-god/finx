import { useState } from 'react';
import { Button, Input, Switch } from '@/ui';
import { formatDate } from '@/lib/format/date';
import { formatMinor, parseToMinor } from '@/lib/format/currency';
import type { WizardDraft } from './WizardShell';

type Props = {
  draft: WizardDraft;
  onChange: (patch: Partial<WizardDraft>) => void;
  onNext: () => void;
};

export default function StepGoal({ draft, onChange, onNext }: Props) {
  const [error, setError] = useState<string | null>(null);
  const enabled = draft.targetAmountMinor !== null;
  const amountRaw = draft.targetAmountMinor ? (draft.targetAmountMinor / 100).toString() : '';
  const dateRaw = draft.targetDate ? new Date(draft.targetDate).toISOString().slice(0, 10) : '';

  const submit = () => {
    if (!enabled) return onNext();
    if (draft.targetAmountMinor === null || draft.targetAmountMinor <= 0) {
      return setError('Enter a positive target amount.');
    }
    if (draft.targetDate !== null && draft.targetDate < Date.now()) {
      return setError('Target date must be in the future.');
    }
    setError(null);
    onNext();
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Set a goal</h2>
        <p className="text-sm text-dim mt-1">
          Optional. Track progress toward a target — like saving for a phone or a trip.
        </p>
      </div>

      <Switch
        checked={enabled}
        onChange={(on) =>
          onChange({
            targetAmountMinor: on ? (draft.targetAmountMinor ?? 0) : null,
            targetDate: on ? draft.targetDate : null,
          })
        }
        label="Enable savings goal"
        hint={enabled ? 'Track progress toward a target amount.' : 'Skip this to use as a regular wallet.'}
      />

      {enabled && (
        <>
          <Input
            label="Target amount"
            placeholder="0.00"
            value={amountRaw}
            onChange={(e) => onChange({ targetAmountMinor: parseToMinor(e.target.value) ?? 0 })}
            inputMode="decimal"
            hint={
              draft.targetAmountMinor !== null && draft.targetAmountMinor > 0
                ? `Goal: ${formatMinor(draft.targetAmountMinor, 'USD')}`
                : undefined
            }
            error={error ?? undefined}
          />
          <Input
            label="Target date"
            type="date"
            value={dateRaw}
            onChange={(e) =>
              onChange({ targetDate: e.target.value ? new Date(e.target.value).getTime() : null })
            }
            hint={draft.targetDate ? `By ${formatDate(draft.targetDate)}` : 'Optional. No deadline.'}
          />
        </>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button onClick={submit}>Next</Button>
      </div>
    </div>
  );
}
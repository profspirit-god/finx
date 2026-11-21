import { Button, Input } from '@/ui';
import type { WizardDraft } from './WizardShell';

type Props = {
  draft: WizardDraft;
  onChange: (patch: Partial<WizardDraft>) => void;
  onNext: () => void;
};

export default function StepDescription({ draft, onChange, onNext }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Describe it</h2>
        <p className="text-sm text-dim mt-1">Optional. Helps you tell similar wallets apart.</p>
      </div>

      <Input
        label="Description"
        placeholder="e.g. Daily spending, Long-term savings"
        value={draft.description}
        onChange={(e) => onChange({ description: e.target.value })}
        autoFocus
      />

      <div className="flex justify-end pt-2">
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
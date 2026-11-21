import { useState } from 'react';
import { Button, Input } from '@/ui';

type Props = {
  initial: { description: string };
  onNext: (patch: { description: string }) => void;
};

export default function StepDescription({ initial, onNext }: Props) {
  const [description, setDescription] = useState(initial.description);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Describe it</h2>
        <p className="text-sm text-dim mt-1">Optional. Helps you tell similar wallets apart.</p>
      </div>

      <Input
        label="Description"
        placeholder="e.g. Daily spending, Long-term savings"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        autoFocus
      />

      <div className="flex justify-end pt-2">
        <Button onClick={() => onNext({ description: description.trim() })}>
          Next
        </Button>
      </div>
    </div>
  );
}
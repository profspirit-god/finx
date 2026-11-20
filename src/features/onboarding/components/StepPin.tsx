import { useState } from 'react';
import { Button, Notice } from '@/ui';
import OnboardingShell from './OnboardingShell';
import PinPad from '@/features/lock/components/PinPad';

type Props = { onNext: (pin: string) => void };

export default function StepPin({ onNext }: Props) {
  const [stage, setStage] = useState<'create' | 'confirm'>('create');
  const [first, setFirst] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreate = (pin: string) => {
    setFirst(pin);
    setValue('');
    setStage('confirm');
  };

  const handleConfirm = (pin: string) => {
    if (pin !== first) {
      setError('PINs do not match. Try again.');
      setFirst('');
      setValue('');
      setStage('create');
      return;
    }
    setError(null);
    onNext(pin);
  };

  return (
    <OnboardingShell
      step={3}
      totalSteps={5}
      title={stage === 'create' ? 'Set a 4-digit PIN' : 'Confirm your PIN'}
      subtitle="You'll enter this every time you open FinX."
      footer={
        <Button
          variant="ghost"
          onClick={() => {
            setFirst('');
            setValue('');
            setStage('create');
            setError(null);
          }}
        >
          Start over
        </Button>
      }
    >
      <div className="flex flex-col items-center gap-4">
        {error && <Notice variant="error">{error}</Notice>}
        <PinPad
          value={value}
          onChange={setValue}
          onSubmit={stage === 'create' ? handleCreate : handleConfirm}
        />
      </div>
    </OnboardingShell>
  );
}
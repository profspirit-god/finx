import { useState } from 'react';
import { Button, Input, Notice } from '@/ui';
import OnboardingShell from './OnboardingShell';

type Props = {
  onNext: (input: { displayName: string; password: string }) => void;
};

export default function StepSignup({ onNext }: Props) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (name.trim().length < 2) return setError('Name must be at least 2 characters.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setError(null);
    onNext({ displayName: name.trim(), password });
  };

  return (
    <OnboardingShell
      step={1}
      totalSteps={5}
      title="Welcome to FinX"
      subtitle="Create your local profile. All data stays on this device."
      footer={<Button onClick={submit}>Continue</Button>}
    >
      <div className="space-y-4">
        {error && <Notice variant="error" title="Check your input">{error}</Notice>}
        <Input label="Display name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex" autoFocus />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} hint="At least 6 characters. Used for account recovery." />
        <Input label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </div>
    </OnboardingShell>
  );
}
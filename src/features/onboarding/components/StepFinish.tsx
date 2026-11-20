import { Button } from '@/ui';
import OnboardingShell from './OnboardingShell';

type Props = { onNext: () => void };

export default function StepFinish({ onNext }: Props) {
  return (
    <OnboardingShell
      step={5}
      totalSteps={5}
      title="You're all set"
      subtitle="FinX will lock immediately so you can confirm your PIN."
      footer={<Button onClick={onNext}>Lock and continue</Button>}
    >
      <div className="space-y-3 text-sm text-dim">
        <p>Next, we'll lock the app. Enter the 4-digit PIN you just created to unlock it.</p>
        <p>Every time you open FinX, you'll be asked for this PIN. Your password is a backup for recovery in Settings.</p>
      </div>
    </OnboardingShell>
  );
}
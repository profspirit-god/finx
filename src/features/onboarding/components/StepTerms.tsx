import { useState } from 'react';
import { Button, Switch } from '@/ui';
import OnboardingShell from './OnboardingShell';

type Props = { onNext: () => void };

export default function StepTerms({ onNext }: Props) {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptLocal, setAcceptLocal] = useState(false);

  const ready = acceptTerms && acceptLocal;

  return (
    <OnboardingShell
      step={2}
      totalSteps={5}
      title="Terms & data"
      subtitle="How FinX stores and handles your information."
      footer={<Button onClick={onNext} disabled={!ready}>Accept and continue</Button>}
    >
      <div className="space-y-5">
        <div className="text-sm text-dim space-y-2 max-h-48 overflow-auto pr-1">
          <p><strong className="text-white">Local-first.</strong> FinX stores all data in your browser (IndexedDB). Nothing is sent to a server.</p>
          <p><strong className="text-white">No account recovery.</strong> Your password and PIN protect this device's data. If you forget both, the only recovery is wiping local data.</p>
          <p><strong className="text-white">You control backups.</strong> Use Data Tools to export and import. FinX never uploads backups for you.</p>
          <p><strong className="text-white">AI Assistant (optional).</strong> If enabled later, you supply your own API key. FinX sends only what you type in the assistant, never your financial records.</p>
        </div>
        <Switch checked={acceptTerms} onChange={setAcceptTerms} label="I accept the Terms of Service" hint="You can review these later in Settings." />
        <Switch checked={acceptLocal} onChange={setAcceptLocal} label="I understand data is stored locally" hint="Only this browser profile can access it." />
      </div>
    </OnboardingShell>
  );
}
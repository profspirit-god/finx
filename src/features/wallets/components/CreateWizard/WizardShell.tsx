import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/ui';
import StepName from './StepName';
import StepDescription from './StepDescription';
import StepStartingMoney from './StepStartingMoney';
import type { WalletInput } from '@/types/wallet';
import { useWallets } from '@/features/wallets/hooks/useWallets';

type Draft = {
  name: string;
  description: string;
  type: WalletInput['type'];
  color: string;
  startingBalanceMinor: number;
};

const DEFAULT_COLOR = '#F5B800';

const INITIAL: Draft = {
  name: '',
  description: '',
  type: 'cash',
  color: DEFAULT_COLOR,
  startingBalanceMinor: 0,
};

export default function WizardShell() {
  const navigate = useNavigate();
  const { create } = useWallets();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(INITIAL);
  const [saving, setSaving] = useState(false);

  const totalSteps = 3;
  const pct = Math.round((step / totalSteps) * 100);

  const close = () => navigate('/wallets');

  const save = async () => {
    setSaving(true);
    try {
      const wallet = await create({
        name: draft.name,
        description: draft.description,
        type: draft.type,
        currency: 'USD',
        startingBalanceMinor: draft.startingBalanceMinor,
        color: draft.color,
        iconKey: null,
        targetAmountMinor: null,
        targetDate: null,
      });
      navigate(`/wallets/${wallet.id}`, { replace: true });
    } catch (err) {
      setSaving(false);
      console.error('[FinX] Failed to create wallet:', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-6">
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft size={16} strokeWidth={2} />}
          onClick={() => (step > 1 ? setStep(step - 1) : close())}
        >
          {step > 1 ? 'Back' : 'Cancel'}
        </Button>
        <p className="text-xs text-dim">
          Step {step} of {totalSteps}
        </p>
        <button
          onClick={close}
          aria-label="Close"
          className="p-2 rounded-lg text-dim hover:text-white hover:bg-white/5 transition-colors"
        >
          <X size={18} strokeWidth={1.75} />
        </button>
      </div>

      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-6">
        <div
          className="h-full bg-gold-400 rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="glass-strong p-6">
        {step === 1 && (
          <StepName
            initial={draft}
            onNext={(patch) => {
              setDraft((d) => ({ ...d, ...patch }));
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <StepDescription
            initial={draft}
            onNext={(patch) => {
              setDraft((d) => ({ ...d, ...patch }));
              setStep(3);
            }}
          />
        )}
        {step === 3 && (
          <StepStartingMoney
            initial={draft}
            saving={saving}
            onBack={() => setStep(2)}
            onSave={(patch) => {
              setDraft((d) => ({ ...d, ...patch }));
              void save();
            }}
          />
        )}
      </div>
    </div>
  );
}
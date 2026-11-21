import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/ui';
import StepName from './StepName';
import StepDescription from './StepDescription';
import StepStartingMoney from './StepStartingMoney';
import StepGoal from './StepGoal';
import StepReview from './StepReview';
import type { WalletInput } from '@/types/wallet';
import { useWallets } from '@/features/wallets/hooks/useWallets';
import { useCurrency } from '@/lib/hooks/useCurrency';

export type WizardDraft = {
  name: string;
  description: string;
  type: WalletInput['type'];
  color: string;
  startingBalanceMinor: number;
  targetAmountMinor: number | null;
  targetDate: number | null;
};

const INITIAL: WizardDraft = {
  name: '',
  description: '',
  type: 'cash',
  color: '#F5B800',
  startingBalanceMinor: 0,
  targetAmountMinor: null,
  targetDate: null,
};

export default function WizardShell() {
  const navigate = useNavigate();
  const { create } = useWallets();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<WizardDraft>(INITIAL);
  const [saving, setSaving] = useState(false);
  const currency = useCurrency();

  const totalSteps = 5;
  const pct = Math.round((step / totalSteps) * 100);

  const close = () => navigate('/wallets');
  const patch = (p: Partial<WizardDraft>) => setDraft((d) => ({ ...d, ...p }));
  const next = () => setStep((s) => Math.min(totalSteps, s + 1));
  const back = () => (step > 1 ? setStep(step - 1) : close());

  const save = async () => {
    setSaving(true);
    try {
      const wallet = await create({
        name: draft.name,
        description: draft.description,
        type: draft.type,
        currency: currency,
        startingBalanceMinor: draft.startingBalanceMinor,
        color: draft.color,
        iconKey: null,
        targetAmountMinor: draft.targetAmountMinor,
        targetDate: draft.targetDate,
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
        <Button variant="ghost" leftIcon={<ArrowLeft size={16} strokeWidth={2} />} onClick={back}>
          {step > 1 ? 'Back' : 'Cancel'}
        </Button>
        <p className="text-xs text-dim">Step {step} of {totalSteps}</p>
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
        {step === 1 && <StepName draft={draft} onChange={patch} onNext={next} />}
        {step === 2 && <StepDescription draft={draft} onChange={patch} onNext={next} />}
        {step === 3 && <StepStartingMoney draft={draft} onChange={patch} onNext={next} />}
        {step === 4 && <StepGoal draft={draft} onChange={patch} onNext={next} />}
        {step === 5 && (
          <StepReview draft={draft} saving={saving} onBack={back} onCreate={() => void save()} />
        )}
      </div>
    </div>
  );
}
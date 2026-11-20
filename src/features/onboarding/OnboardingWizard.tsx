import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepSignup from './components/StepSignup';
import StepTerms from './components/StepTerms';
import StepPin from './components/StepPin';
import StepPersonalize from './components/StepPersonalize';
import StepFinish from './components/StepFinish';
import { useAuthStore } from '@/features/auth';

type Draft = {
  displayName: string;
  password: string;
  pin: string;
  personalize: {
    primaryCurrency: string;
    trackMode: 'implicit' | 'explicit';
    monthlyIncomeEstimate: number | null;
    savingsGoalEstimate: number | null;
  } | null;
};

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const signup = useAuthStore((s) => s.signup);
  const completePersonalization = useAuthStore((s) => s.completePersonalization);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>({
    displayName: '',
    password: '',
    pin: '',
    personalize: null,
  });

  return (
    <>
      {step === 1 && (
        <StepSignup
          onNext={({ displayName, password }) => {
            setDraft((d) => ({ ...d, displayName, password }));
            setStep(2);
          }}
        />
      )}
      {step === 2 && <StepTerms onNext={() => setStep(3)} />}
      {step === 3 && (
        <StepPin
          onNext={(pin) => {
            setDraft((d) => ({ ...d, pin }));
            setStep(4);
          }}
        />
      )}
      {step === 4 && (
        <StepPersonalize
          onNext={(personalize) => {
            setDraft((d) => ({ ...d, personalize }));
            setStep(5);
          }}
        />
      )}
      {step === 5 && (
        <StepFinish
          onNext={async () => {
            await signup({
              displayName: draft.displayName,
              password: draft.password,
              pin: draft.pin,
            });
            if (draft.personalize) {
              await completePersonalization(draft.personalize);
            }
            // Auth state is now 'locked' — guard will route to /lock
            navigate('/lock', { replace: true });
          }}
        />
      )}
    </>
  );
}
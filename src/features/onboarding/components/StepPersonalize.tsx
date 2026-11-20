import { useState } from 'react';
import { Button, Input, Select, Switch } from '@/ui';
import OnboardingShell from './OnboardingShell';
import { parseToMinor } from '@/lib/format/currency';

type Props = {
  onNext: (input: {
    primaryCurrency: string;
    trackMode: 'implicit' | 'explicit';
    monthlyIncomeEstimate: number | null;
    savingsGoalEstimate: number | null;
  }) => void;
};

const CURRENCIES = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'PHP', label: 'PHP — Philippine Peso' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — Pound Sterling' },
  { value: 'JPY', label: 'JPY — Japanese Yen' },
  { value: 'AUD', label: 'AUD — Australian Dollar' },
  { value: 'CAD', label: 'CAD — Canadian Dollar' },
  { value: 'SGD', label: 'SGD — Singapore Dollar' },
];

export default function StepPersonalize({ onNext }: Props) {
  const [currency, setCurrency] = useState('USD');
  const [explicit, setExplicit] = useState(false);
  const [income, setIncome] = useState('');
  const [savings, setSavings] = useState('');

  const submit = () => {
    const incomeMinor = income ? parseToMinor(income) : null;
    const savingsMinor = savings ? parseToMinor(savings) : null;
    onNext({
      primaryCurrency: currency,
      trackMode: explicit ? 'explicit' : 'implicit',
      monthlyIncomeEstimate: incomeMinor,
      savingsGoalEstimate: savingsMinor,
    });
  };

  return (
    <OnboardingShell
      step={4}
      totalSteps={5}
      title="Make it yours"
      subtitle="You can change any of these later in Settings."
      footer={<Button onClick={submit}>Continue</Button>}
    >
      <div className="space-y-4">
        <Select
          label="Primary currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          options={CURRENCIES}
        />
        <Switch
          checked={explicit}
          onChange={setExplicit}
          label="Explicit tracking"
          hint={
            explicit
              ? 'Track each account separately (e.g. GCash, bank, cash).'
              : 'Track money implicitly (cash on hand, savings, investments).'
          }
        />
        <Input
          label="Monthly income estimate"
          placeholder="e.g. 3000"
          hint="Optional. Used for rate calculations."
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          inputMode="decimal"
        />
        <Input
          label="Monthly savings goal"
          placeholder="e.g. 500"
          hint="Optional. Used for progress tracking."
          value={savings}
          onChange={(e) => setSavings(e.target.value)}
          inputMode="decimal"
        />
      </div>
    </OnboardingShell>
  );
}
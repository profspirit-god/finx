import type { ReactElement } from 'react';
import { LockScreen } from '@/features/lock';
import { OnboardingWizard } from '@/features/onboarding';
import { useAuthStore } from '@/features/auth';
import { Button } from '@/ui';

function Placeholder({ label }: { label: string }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">{label}</h1>
      <p className="text-dim mt-2">Coming in a later step.</p>
    </div>
  );
}

function HelpPage() {
  const reset = useAuthStore((s) => s.reset);
  const lock = useAuthStore((s) => s.lock);
  return (
    <div className="p-8 space-y-4 max-w-xl">
      <h1 className="text-2xl font-semibold">Help</h1>
      <p className="text-dim text-sm">Temporary actions for testing. Removed in a later version.</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={lock}>Lock now</Button>
        <Button
          variant="danger"
          onClick={async () => {
            if (!confirm('Wipe the local user and restart onboarding?')) return;
            await reset();
            window.location.href = '/onboarding';
          }}
        >
          Reset onboarding
        </Button>
      </div>
    </div>
  );
}

export const routes: { path: string; element: ReactElement }[] = [
  { path: '/',           element: <Placeholder label="Dashboard" /> },
  { path: '/dashboard',  element: <Placeholder label="Dashboard" /> },
  { path: '/wallets',    element: <Placeholder label="Wallets" /> },
  { path: '/records',    element: <Placeholder label="Records" /> },
  { path: '/data-tools', element: <Placeholder label="Data Tools" /> },
  { path: '/ai',         element: <Placeholder label="AI Assistant" /> },
  { path: '/settings',   element: <Placeholder label="Settings" /> },
  { path: '/help',       element: <HelpPage /> },
  { path: '/lock',       element: <LockScreen /> },
  { path: '/onboarding', element: <OnboardingWizard /> },
];
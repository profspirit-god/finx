import type { ReactElement } from 'react';
import { LockScreen } from '@/features/lock';
import { OnboardingWizard } from '@/features/onboarding';
import { WalletList, WalletDetail, WizardShell } from '@/features/wallets';
import { RecordList, RecordForm, RecordDetail } from '@/features/records';
import { useAuthStore } from '@/features/auth';
import { Button } from '@/ui';
import { DashboardPage } from '@/features/dashboard';
import { DataToolsPage } from '@/features/data-tools';

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
    <div className="p-8 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">Help</h1>
      <p className="text-dim text-sm">Temporary actions for testing. Full Help arrives in v1.7.0.0.</p>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-white">Test actions</h2>
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
      </section>

      <section id="url-errors" className="space-y-2">
        <h2 className="text-sm font-semibold text-white">URL errors</h2>
        <ErrorTable rows={[
          ['URL1', 'Wallet not found', 'The wallet id in the URL does not exist.'],
          ['URL2', 'Record not found', 'The record id in the URL does not exist.'],
          ['URL3', 'Page not found', 'The route does not exist in FinX.'],
        ]} />
      </section>

      <section id="data-errors" className="space-y-2">
        <h2 className="text-sm font-semibold text-white">Data errors</h2>
        <ErrorTable rows={[
          ['DATA1', 'Wallet load failed', 'IndexedDB read failed for wallet data.'],
          ['DATA2', 'Record load failed', 'IndexedDB read failed for record data.'],
          ['DATA3', 'Local storage corrupted', 'FinX cannot open its database.'],
        ]} />
      </section>

      <section id="auth-errors" className="space-y-2">
        <h2 className="text-sm font-semibold text-white">Auth errors</h2>
        <ErrorTable rows={[
          ['AUTH1', 'Session expired', 'The session was cleared. Unlock again.'],
          ['AUTH2', 'Incorrect PIN', 'Wrong PIN entered at the lock screen.'],
        ]} />
      </section>

      <section id="system-errors" className="space-y-2">
        <h2 className="text-sm font-semibold text-white">System errors</h2>
        <ErrorTable rows={[
          ['SYS1', 'Unexpected error', 'Unhandled exception caught by ErrorBoundary.'],
          ['SYS2', 'Offline', 'Action needs a network connection.'],
          ['SYS3', 'Storage full', 'Local storage quota exceeded.'],
        ]} />
      </section>
    </div>
  );
}

function ErrorTable({ rows }: { rows: [string, string, string][] }) {
  return (
    <div className="glass overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-white/5">
          <tr>
            <th className="text-left px-3 py-2 text-xs font-medium text-dim w-24">Code</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-dim w-40">Title</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-dim">Meaning</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([code, title, meaning]) => (
            <tr key={code} className="border-t border-[var(--line)]">
              <td className="px-3 py-2 font-mono text-gold-400 text-xs">{code}</td>
              <td className="px-3 py-2">{title}</td>
              <td className="px-3 py-2 text-dim">{meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const routes: { path: string; element: ReactElement }[] = [
  { path: '/',             element: <DashboardPage /> },
  { path: '/dashboard',    element: <DashboardPage /> },
  { path: '/wallets',      element: <WalletList /> },
  { path: '/wallets/new',  element: <WizardShell /> },
  { path: '/wallets/:id',  element: <WalletDetail /> },
  { path: '/records',      element: <RecordList /> },
  { path: '/records/new',  element: <RecordForm /> },
  { path: '/records/:id',  element: <RecordDetail /> },
  { path: '/data-tools',   element: <DataToolsPage /> },
  { path: '/ai',           element: <Placeholder label="AI Assistant" /> },
  { path: '/settings',     element: <Placeholder label="Settings" /> },
  { path: '/help',         element: <HelpPage /> },
  { path: '/lock',         element: <LockScreen /> },
  { path: '/onboarding',   element: <OnboardingWizard /> },
];
import type { ReactElement } from 'react';
import { LockScreen } from '@/features/lock';
import { OnboardingWizard } from '@/features/onboarding';
import { WalletList, WalletDetail, WizardShell } from '@/features/wallets';
import { RecordList, RecordForm, RecordDetail } from '@/features/records';
import { useAuthStore } from '@/features/auth';
import { Button, Dialog } from '@/ui';
import { DashboardPage } from '@/features/dashboard';
import { DataToolsPage } from '@/features/data-tools';
import { useState } from 'react';
import { DevGuard, DevLogin, DevDashboard } from '@/features/dev-mode';
import { NoticesPage } from '@/features/notices';

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
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmWipe, setConfirmWipe] = useState(false);

  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">Help</h1>
      <p className="text-dim text-sm">Temporary actions for testing. Full Help arrives in v1.7.0.0.</p>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-white">Test actions</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={lock}>Lock now</Button>
          <Button variant="secondary" onClick={() => setConfirmReset(true)}>
            Reset onboarding (keep data)
          </Button>
          <Button variant="danger" onClick={() => setConfirmWipe(true)}>
            Wipe all data
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

      <Dialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset onboarding?"
        description="Your user profile (name, password, PIN) will be removed and you'll redo the wizard. All wallets, records, and receipts are kept."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                setConfirmReset(false);
                await reset();
                window.location.href = '/onboarding';
              }}
            >
              Reset onboarding
            </Button>
          </>
        }
      >
        <p className="text-sm text-dim">You will need to enter a new name, password, and PIN.</p>
      </Dialog>

      <Dialog
        open={confirmWipe}
        onClose={() => setConfirmWipe(false)}
        title="Wipe all data?"
        description="Every wallet, record, receipt, and the current user will be permanently deleted from this device."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmWipe(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={async () => {
                setConfirmWipe(false);
                const { dbClearAll } = await import('@/lib/db/idb');
                await dbClearAll();
                window.location.href = '/';
              }}
            >
              Yes, wipe everything
            </Button>
          </>
        }
      >
        <p className="text-sm text-[var(--sys-red)]">
          This cannot be undone. Export a full backup first if you want to keep your data.
        </p>
      </Dialog>
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
  { path: '/notices',    element: <NoticesPage /> },
  { path: '/help',         element: <HelpPage /> },
  { path: '/lock',         element: <LockScreen /> },
  { path: '/onboarding',   element: <OnboardingWizard /> },
  { path: '/dev-login',  element: <DevLogin /> },
  { path: '/dev',        element: <DevGuard><DevDashboard /></DevGuard> },
];
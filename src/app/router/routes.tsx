import type { ReactElement } from 'react';

/** Placeholder page component. Replaced by real features in later steps. */
function Placeholder({ label }: { label: string }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">{label}</h1>
      <p className="text-dim mt-2">Coming in a later step.</p>
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
  { path: '/help',       element: <Placeholder label="Help" /> },
];
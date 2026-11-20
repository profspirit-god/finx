import type { ReactNode } from 'react';

/**
 * Placeholder provider — Tooltip in FinX is a self-contained component
 * (no global state), so this exists only to keep the provider stack
 * symmetric and future-extensible (e.g. delay preferences).
 */
export function TooltipProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default TooltipProvider;
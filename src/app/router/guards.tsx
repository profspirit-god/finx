import type { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/state/auth.store';

/**
 * Blocks access until auth status is resolved (loading → resolved).
 * Also enforces the onboarding → lock → dashboard flow.
 */
export function AuthGuard({ children }: { children: ReactElement }) {
  const state = useAuthStore((s) => s.state);
  const location = useLocation();

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-dim text-sm">
        Loading…
      </div>
    );
  }

  if (state.status === 'needs-onboarding' && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (state.status === 'locked' && location.pathname !== '/lock') {
    return <Navigate to="/lock" replace />;
  }

  if (state.status === 'unlocked' && (location.pathname === '/onboarding' || location.pathname === '/lock')) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
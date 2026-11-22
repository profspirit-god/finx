import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAdminSession } from './auth';

export function DevGuard({ children }: { children: React.ReactElement }) {
  const [status, setStatus] = useState<'checking' | 'allowed' | 'denied'>('checking');
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const ok = await isAdminSession();
      if (cancelled) return;
      setStatus(ok ? 'allowed' : 'denied');
    })();
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  if (status === 'checking') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-dim text-sm">
        Verifying developer session…
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/dev-login" replace />;
  }

  return children;
}
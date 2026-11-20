import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/features/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return <>{children}</>;
}

export default AuthProvider;
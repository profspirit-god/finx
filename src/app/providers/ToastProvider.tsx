import type { ReactNode } from 'react';
import { ToastProvider as UIToastProvider } from '@/ui';

export function ToastProvider({ children }: { children: ReactNode }) {
  return <UIToastProvider>{children}</UIToastProvider>;
}

export default ToastProvider;
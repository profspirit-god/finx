import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>{children}</MotionConfig>;
}

export default MotionProvider;
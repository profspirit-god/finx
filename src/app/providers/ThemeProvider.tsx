import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

type Theme = 'dark';

type Ctx = { theme: Theme };

const ThemeCtx = createContext<Ctx>({ theme: 'dark' });

export function ThemeProvider({ children }: { children: ReactNode }) {
  // FinX is dark-only. Hook kept for future theming.
  return <ThemeCtx.Provider value={{ theme: 'dark' }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}

export default ThemeProvider;
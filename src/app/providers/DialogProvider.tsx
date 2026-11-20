import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { Dialog } from '@/ui';

type DialogOptions = {
  title?: string;
  description?: string;
  content?: ReactNode;
  footer?: ReactNode;
};

type Ctx = {
  open: (opts: DialogOptions) => void;
  close: () => void;
};

const DialogCtx = createContext<Ctx | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<(DialogOptions & { visible: boolean })>({
    visible: false,
  });

  const open = useCallback((opts: DialogOptions) => {
    setState({ ...opts, visible: true });
  }, []);

  const close = useCallback(() => {
    setState((s) => ({ ...s, visible: false }));
  }, []);

  return (
    <DialogCtx.Provider value={{ open, close }}>
      {children}
      <Dialog
        open={state.visible}
        onClose={close}
        title={state.title}
        description={state.description}
        footer={state.footer}
      >
        {state.content}
      </Dialog>
    </DialogCtx.Provider>
  );
}

export function useDialog() {
  const ctx = useContext(DialogCtx);
  if (!ctx) throw new Error('useDialog must be used inside <DialogProvider>');
  return ctx;
}

export default DialogProvider;
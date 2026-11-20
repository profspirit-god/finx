import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

type Variant = 'info' | 'success' | 'warning' | 'error';
type ToastItem = { id: string; variant: Variant; title?: string; message: string; duration: number };

type Ctx = { push: (t: Omit<ToastItem, 'id' | 'duration'> & { duration?: number }) => void };

const ToastCtx = createContext<Ctx | null>(null);

const palette: Record<Variant, { bg: string; border: string; text: string; Icon: typeof Info }> = {
  info:    { bg: 'bg-[var(--sys-blue)]/15',   border: 'border-[var(--sys-blue)]/40',   text: 'text-[var(--sys-blue)]',   Icon: Info },
  success: { bg: 'bg-[var(--sys-green)]/15',  border: 'border-[var(--sys-green)]/40',  text: 'text-[var(--sys-green)]',  Icon: CheckCircle2 },
  warning: { bg: 'bg-[var(--sys-orange)]/15', border: 'border-[var(--sys-orange)]/40', text: 'text-[var(--sys-orange)]', Icon: AlertTriangle },
  error:   { bg: 'bg-[var(--sys-red)]/15',    border: 'border-[var(--sys-red)]/40',    text: 'text-[var(--sys-red)]',    Icon: XCircle },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback<Ctx['push']>((t) => {
    const id = crypto.randomUUID();
    setItems((prev) => [...prev, { id, duration: 4000, ...t }]);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none"
        aria-live="polite"
      >
        {items.map((t) => <ToastCard key={t.id} toast={t} onClose={() => remove(t.id)} />)}
      </div>
    </ToastCtx.Provider>
  );
}

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const p = palette[toast.variant];
  useEffect(() => {
    const t = setTimeout(onClose, toast.duration);
    return () => clearTimeout(t);
  }, [toast.duration, onClose]);
  return (
    <div
      role={toast.variant === 'error' ? 'alert' : 'status'}
      className={[
        'pointer-events-auto flex items-start gap-3 p-3 rounded-xl glass-strong border animate-slide-up',
        p.bg, p.border,
      ].join(' ')}
    >
      <p.Icon size={18} strokeWidth={1.75} className={['shrink-0 mt-0.5', p.text].join(' ')} />
      <div className="flex-1 min-w-0">
        {toast.title && <p className={['text-sm font-medium', p.text].join(' ')}>{toast.title}</p>}
        <p className="text-sm text-white/90">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="shrink-0 text-dim hover:text-white transition-colors"
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

export default ToastProvider;
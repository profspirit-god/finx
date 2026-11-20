import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

type Variant = 'info' | 'success' | 'warning' | 'error';

type Props = {
  variant?: Variant;
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
};

const palette: Record<Variant, { bg: string; border: string; text: string; Icon: typeof Info }> = {
  info:    { bg: 'bg-[var(--sys-blue)]/10',   border: 'border-[var(--sys-blue)]/30',   text: 'text-[var(--sys-blue)]',   Icon: Info },
  success: { bg: 'bg-[var(--sys-green)]/10',  border: 'border-[var(--sys-green)]/30',  text: 'text-[var(--sys-green)]',  Icon: CheckCircle2 },
  warning: { bg: 'bg-[var(--sys-orange)]/10', border: 'border-[var(--sys-orange)]/30', text: 'text-[var(--sys-orange)]', Icon: AlertTriangle },
  error:   { bg: 'bg-[var(--sys-red)]/10',    border: 'border-[var(--sys-red)]/30',    text: 'text-[var(--sys-red)]',    Icon: XCircle },
};

export function Notice({ variant = 'info', title, children, action, onClose }: Props) {
  const p = palette[variant];
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={['flex items-start gap-3 p-3 rounded-xl border', p.bg, p.border].join(' ')}
    >
      <p.Icon size={18} strokeWidth={1.75} className={['shrink-0 mt-0.5', p.text].join(' ')} />
      <div className="flex-1 min-w-0">
        {title && <p className={['text-sm font-medium', p.text].join(' ')}>{title}</p>}
        <div className="text-sm text-dim">{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss"
          className="shrink-0 text-dim hover:text-white transition-colors"
        >
          <XCircle size={16} strokeWidth={1.75} className="opacity-60" />
        </button>
      )}
    </div>
  );
}

export default Notice;
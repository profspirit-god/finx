import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

type Props = {
  title?: string;
  description?: string;
  hint?: string;
  onRetry?: () => void;
  helpHref?: string;
  children?: ReactNode;
  className?: string;
};

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred.',
  hint,
  onRetry,
  helpHref,
  children,
  className = '',
}: Props) {
  return (
    <div
      role="alert"
      className={[
        'flex flex-col items-center text-center p-6 rounded-2xl',
        'glass border-[var(--sys-red)]/30',
        className,
      ].join(' ')}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-[var(--sys-red)]/15">
        <AlertTriangle size={22} strokeWidth={1.75} className="text-[var(--sys-red)]" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-sm text-dim mt-1.5 max-w-sm">{description}</p>
      {hint && <p className="text-xs text-mute mt-2 max-w-sm">{hint}</p>}
      {children}
      {(onRetry || helpHref) && (
        <div className="flex items-center gap-2 mt-5">
          {onRetry && <Button size="sm" variant="secondary" onClick={onRetry}>Try again</Button>}
          {helpHref && (
            <Button size="sm" variant="ghost" onClick={() => { window.location.href = helpHref; }}>
              Open Help
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default ErrorState;
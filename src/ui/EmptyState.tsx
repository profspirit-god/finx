import type { ReactNode } from 'react';

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className = '' }: Props) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center py-12 px-6 rounded-2xl',
        'border border-dashed border-[var(--line)]',
        className,
      ].join(' ')}
    >
      {icon && (
        <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center mb-4 text-gold-400">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {description && <p className="text-sm text-dim mt-1.5 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyState;
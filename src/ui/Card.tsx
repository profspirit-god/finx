import type { HTMLAttributes, ReactNode } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  padded?: boolean;
  interactive?: boolean;
};

export function Card({
  title,
  subtitle,
  headerAction,
  padded = true,
  interactive = false,
  className = '',
  children,
  ...rest
}: Props) {
  const hasHeader = title || subtitle || headerAction;
  return (
    <div
      className={[
        'glass',
        interactive
          ? 'transition-colors duration-200 hover:bg-white/[0.06] cursor-pointer'
          : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {hasHeader && (
        <div className="flex items-start justify-between gap-3 px-4 pt-4">
          <div className="min-w-0">
            {title && <h3 className="text-sm font-semibold text-white truncate">{title}</h3>}
            {subtitle && <p className="text-xs text-dim mt-0.5 truncate">{subtitle}</p>}
          </div>
          {headerAction}
        </div>
      )}
      <div className={padded ? 'p-4' : ''}>{children}</div>
    </div>
  );
}

export default Card;
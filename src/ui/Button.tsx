import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-5 text-base gap-2.5',
};

const variants: Record<Variant, string> = {
  primary:
    'bg-gold-400 text-black font-medium hover:bg-gold-300 border border-gold-400 shadow-gold',
  secondary:
    'glass text-white hover:bg-white/10 border border-[var(--line)]',
  ghost:
    'text-white hover:bg-white/5 border border-transparent',
  danger:
    'bg-[var(--sys-red)] text-white hover:opacity-90 border border-[var(--sys-red)]',
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    loading = false,
    disabled,
    className = '',
    children,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center rounded-xl',
        'transition-colors duration-200 select-none',
        'active:scale-[0.97]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizes[size],
        variants[variant],
        className,
      ].join(' ')}
      {...rest}
    >
      {loading ? (
        <span
          className="inline-block w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
          aria-hidden
        />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
});

export default Button;
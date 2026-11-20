import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, hint, error, leftIcon, rightSlot, id, className = '', ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-dim mb-1.5">
          {label}
        </label>
      )}
      <div
        className={[
          'flex items-center gap-2 h-10 px-3 rounded-xl',
          'bg-white/5 border transition-colors duration-200',
          error
            ? 'border-[var(--sys-red)]'
            : 'border-[var(--line)] focus-within:border-gold-400',
        ].join(' ')}
      >
        {leftIcon && <span className="text-dim shrink-0">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={[
            'flex-1 min-w-0 bg-transparent border-0 outline-none',
            'text-sm text-white placeholder:text-[var(--text-mute)]',
            className,
          ].join(' ')}
          {...rest}
        />
        {rightSlot}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="text-xs mt-1 text-[var(--sys-red)]">{error}</p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs mt-1 text-mute">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;
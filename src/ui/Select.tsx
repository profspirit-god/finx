import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

type Option = { value: string; label: string; disabled?: boolean };

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, hint, error, options, placeholder, id, className = '', ...rest },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const describedBy = error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-medium text-dim mb-1.5">
          {label}
        </label>
      )}
      <div
        className={[
          'relative flex items-center h-10 rounded-xl',
          'bg-white/5 border transition-colors duration-200',
          error
            ? 'border-[var(--sys-red)]'
            : 'border-[var(--line)] focus-within:border-gold-400',
        ].join(' ')}
      >
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={[
            'appearance-none w-full h-full px-3 pr-9 rounded-xl',
            'bg-transparent text-sm text-white outline-none cursor-pointer',
            className,
          ].join(' ')}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled} className="bg-[var(--bg-soft)]">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 pointer-events-none text-dim"
          strokeWidth={1.75}
        />
      </div>
      {error ? (
        <p id={`${selectId}-error`} className="text-xs mt-1 text-[var(--sys-red)]">{error}</p>
      ) : hint ? (
        <p id={`${selectId}-hint`} className="text-xs mt-1 text-mute">{hint}</p>
      ) : null}
    </div>
  );
});

export default Select;
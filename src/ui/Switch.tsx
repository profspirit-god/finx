import { useId } from 'react';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  hint?: string;
  disabled?: boolean;
};

export function Switch({ checked, onChange, label, hint, disabled = false }: Props) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          'relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          checked ? 'bg-gold-400' : 'bg-white/15',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200',
            checked ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white',
          ].join(' ')}
        />
      </button>
      {(label || hint) && (
        <label htmlFor={id} className="cursor-pointer select-none">
          {label && <span className="block text-sm text-white">{label}</span>}
          {hint && <span className="block text-xs text-mute mt-0.5">{hint}</span>}
        </label>
      )}
    </div>
  );
}

export default Switch;
import { useEffect, useRef } from 'react';
import { Delete } from 'lucide-react';

type Props = {
  length?: number;
  value: string;
  onChange: (next: string) => void;
  onSubmit: (pin: string) => void;
  disabled?: boolean;
  error?: boolean;
};

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'];

export default function PinPad({
  length = 4,
  value,
  onChange,
  onSubmit,
  disabled = false,
  error = false,
}: Props) {
  const submittedRef = useRef(false);

  useEffect(() => {
    if (value.length === length && !submittedRef.current) {
      submittedRef.current = true;
      const t = setTimeout(() => onSubmit(value), 120);
      return () => clearTimeout(t);
    }
    if (value.length !== length) submittedRef.current = false;
  }, [value, length, onSubmit]);

  const handleKey = (key: string) => {
    if (disabled) return;
    if (key === 'back') {
      onChange(value.slice(0, -1));
    } else if (key === 'clear') {
      onChange('');
    } else if (value.length < length) {
      onChange(value + key);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Dots */}
      <div className="flex items-center gap-4">
        {Array.from({ length }).map((_, i) => {
          const filled = i < value.length;
          return (
            <span
              key={i}
              aria-hidden
              className={[
                'w-3.5 h-3.5 rounded-full transition-all duration-200',
                error
                  ? 'bg-[var(--sys-red)]'
                  : filled
                    ? 'bg-gold-400 scale-110'
                    : 'bg-white/15',
              ].join(' ')}
            />
          );
        })}
      </div>

      {/* Keys */}
      <div className="grid grid-cols-3 gap-3">
        {KEYS.map((k) => {
          if (k === 'clear' || k === 'back') {
            return (
              <button
                key={k}
                type="button"
                onClick={() => handleKey(k)}
                disabled={disabled}
                aria-label={k === 'clear' ? 'Clear' : 'Backspace'}
                className={[
                  'w-16 h-16 rounded-full flex items-center justify-center',
                  'text-dim hover:text-white hover:bg-white/5 transition-colors',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400',
                  disabled ? 'opacity-40 cursor-not-allowed' : '',
                ].join(' ')}
              >
                {k === 'clear' ? (
                  <span className="text-xs font-medium tracking-wide">CLR</span>
                ) : (
                  <Delete size={20} strokeWidth={1.75} />
                )}
              </button>
            );
          }
          return (
            <button
              key={k}
              type="button"
              onClick={() => handleKey(k)}
              disabled={disabled}
              className={[
                'w-16 h-16 rounded-full flex items-center justify-center',
                'text-xl font-medium text-white',
                'glass hover:bg-white/10 transition-colors',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400',
                disabled ? 'opacity-40 cursor-not-allowed' : '',
              ].join(' ')}
            >
              {k}
            </button>
          );
        })}
      </div>
    </div>
  );
}
type Props = {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  tone?: 'gold' | 'green' | 'orange' | 'red';
  className?: string;
};

const tones: Record<NonNullable<Props['tone']>, string> = {
  gold:   'bg-gold-400',
  green:  'bg-[var(--sys-green)]',
  orange: 'bg-[var(--sys-orange)]',
  red:    'bg-[var(--sys-red)]',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = false,
  tone = 'gold',
  className = '',
}: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          {label && <span className="text-dim">{label}</span>}
          {showPercent && <span className="text-gold-400 font-medium">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 rounded-full bg-white/10 overflow-hidden"
      >
        <div
          className={['h-full rounded-full transition-[width] duration-500 ease-out', tones[tone]].join(' ')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
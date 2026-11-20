import type { ReactNode } from 'react';

type Props = {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function OnboardingShell({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  footer,
}: Props) {
  const pct = Math.round((step / totalSteps) * 100);
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-dim mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span className="text-gold-400 font-medium">{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gold-400 rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="glass-strong p-6">
          <h1 className="text-xl font-semibold">{title}</h1>
          {subtitle && <p className="text-sm text-dim mt-1">{subtitle}</p>}
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6 flex items-center justify-end gap-2">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
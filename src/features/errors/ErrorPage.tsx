import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, LifeBuoy } from 'lucide-react';
import { Button } from '@/ui';
import { ERRORS, type ErrorCode } from '@/lib/errors';

type Props = {
  code: ErrorCode;
  detail?: string;
  onRetry?: () => void;
};

export default function ErrorPage({ code, detail, onRetry }: Props) {
  const info = ERRORS[code];
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="glass-strong p-8 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-[var(--sys-red)]/15">
          <AlertTriangle size={26} strokeWidth={1.75} className="text-[var(--sys-red)]" />
        </div>
        <p className="text-xs font-mono text-gold-400 tracking-widest">{info.code}</p>
        <h1 className="text-xl font-semibold mt-1">{info.title}</h1>
        <p className="text-sm text-dim mt-2">{info.description}</p>
        {detail && (
          <p className="text-xs text-mute mt-2 italic break-words">{detail}</p>
        )}
        {info.hint && <p className="text-xs text-mute mt-3">{info.hint}</p>}

        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {onRetry && <Button onClick={onRetry}>Try again</Button>}
          <Link to="/dashboard">
            <Button variant="secondary" leftIcon={<ArrowLeft size={16} strokeWidth={2} />}>
              Dashboard
            </Button>
          </Link>
          <Link to={`/help#${info.helpAnchor}`}>
            <Button variant="ghost" leftIcon={<LifeBuoy size={16} strokeWidth={2} />}>
              Help
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
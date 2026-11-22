import { Bug, Lightbulb, Check } from 'lucide-react';
import { Button } from '@/ui';
import type { FeedbackRow as Row } from '@/features/feedback/types';
import { formatRelative } from '@/lib/format/date';

type Props = {
  row: Row;
  onToggleHandled: (next: boolean) => void;
  busy?: boolean;
};

export default function FeedbackRow({ row, onToggleHandled, busy }: Props) {
  const isBug = row.type === 'bug';
  const tone = isBug ? 'text-[var(--sys-red)] bg-[var(--sys-red)]/15' : 'text-[var(--sys-orange)] bg-[var(--sys-orange)]/15';
  const Icon = isBug ? Bug : Lightbulb;

  return (
    <div className={`glass p-3 ${row.handled ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tone}`}>
          <Icon size={14} strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-white/10">
              {isBug ? 'Bug' : 'Idea'}
            </span>
            {row.username && (
              <span className="text-xs text-dim truncate">{row.username}</span>
            )}
            {row.handled && (
              <span className="text-xs text-[var(--sys-green)] flex items-center gap-1">
                <Check size={10} strokeWidth={2.5} /> handled
              </span>
            )}
            <span className="text-xs text-mute ml-auto">{formatRelative(new Date(row.created_at).getTime())}</span>
          </div>
          <p className="text-sm text-white whitespace-pre-wrap break-words">{row.message}</p>
          <p className="text-[11px] text-mute mt-1.5">
            v{row.app_version ?? '?'} · {row.id.slice(0, 8)}
          </p>
        </div>
        <Button
          size="sm"
          variant={row.handled ? 'ghost' : 'secondary'}
          onClick={() => onToggleHandled(!row.handled)}
          loading={busy}
        >
          {row.handled ? 'Unmark' : 'Mark handled'}
        </Button>
      </div>
    </div>
  );
}
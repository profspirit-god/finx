import { User, Sparkles, AlertTriangle } from 'lucide-react';
import type { AIMessage } from '@/lib/db/schema';

export default function MessageBubble({ message }: { message: AIMessage }) {
  const isUser = message.role === 'user';
  const isError = !!message.error;

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={[
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
          isUser
            ? 'bg-white/10 text-white'
            : isError
              ? 'bg-[var(--sys-red)]/15 text-[var(--sys-red)]'
              : 'bg-gold-400/15 text-gold-400',
        ].join(' ')}
      >
        {isUser ? <User size={14} strokeWidth={2} /> : isError ? <AlertTriangle size={14} /> : <Sparkles size={14} />}
      </div>
      <div className={`flex-1 min-w-0 max-w-[85%] ${isUser ? 'text-right' : ''}`}>
        {message.commandInvoked && !isUser && (
          <p className="text-[11px] text-mute mb-1">
            via <span className="text-gold-400 font-mono">{message.commandInvoked}</span>
          </p>
        )}
        <div
          className={[
            'inline-block px-3.5 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words text-left',
            isUser
              ? 'bg-gold-400 text-black'
              : isError
                ? 'bg-[var(--sys-red)]/10 border border-[var(--sys-red)]/30 text-white'
                : 'glass text-white',
          ].join(' ')}
        >
          {message.content || (message.streaming ? '…' : '')}
        </div>
        {message.streaming && message.content.length > 0 && (
          <span className="inline-block w-1.5 h-4 ml-1 bg-gold-400 animate-pulse align-middle" />
        )}
        {message.error && (
          <p className="text-xs text-[var(--sys-red)] mt-1.5">{message.error}</p>
        )}
      </div>
    </div>
  );
}
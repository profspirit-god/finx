import { useEffect, useRef, useState } from 'react';
import { Send, Trash2, Settings as SettingsIcon, StopCircle } from 'lucide-react';
import { Button, useToast } from '@/ui';
import { getCachedKey } from '../lib/keyCache';
import { decryptString } from '../lib/crypto';
import { streamChat, messagesForAPI, ChatError } from '../lib/client';
import { findCommand, packContext, COMMANDS } from '../lib/commands';
import { randomId } from '@/lib/crypto/random';
import { useWallets } from '@/features/wallets/hooks/useWallets';
import { useRecords } from '@/features/records/hooks/useRecords';
import type { AIMessage, AISettings } from '@/lib/db/schema';
import MessageBubble from './MessageBubble';
import CommandMenu from './CommandMenu';

type Props = {
  onOpenSettings: () => void;
  settings: AISettings;
};

export default function ChatView({ onOpenSettings, settings }: Props) {
  const toast = useToast();
  const { wallets } = useWallets();
  const { records } = useRecords();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const clearChat = () => {
    setMessages([]);
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    if (val.startsWith('/') && !val.includes(' ')) {
      setShowCommands(true);
    } else {
      setShowCommands(false);
    }
  };

  const send = async () => {
    if (sending) return;
    if (!input.trim()) return;
    if (!settings.apiKeyCiphertext || !settings.apiKeyIv) {
      toast.push({ variant: 'error', title: 'No API key', message: 'Configure AI settings first.' });
      return;
    }
    const key = getCachedKey();
    if (!key) {
      toast.push({
        variant: 'error',
        title: 'AI locked',
        message: 'Your session key expired. Lock and unlock the app to use the assistant.',
      });
      return;
    }

    let apiKey: string;
    try {
      apiKey = await decryptString(settings.apiKeyCiphertext, settings.apiKeyIv, key);
    } catch (err) {
      toast.push({ variant: 'error', title: 'Could not decrypt API key', message: (err as Error).message });
      return;
    }

    const cmd = findCommand(input);
    if (cmd?.id === '/help') {
      const helpContent =
        'Available commands:\n\n' +
        COMMANDS.filter((c) => c.id !== '/help')
          .map((c) => `${c.id} — ${c.description}`)
          .join('\n');
      const sysMsg: AIMessage = {
        id: randomId(),
        role: 'user',
        content: '/help',
        commandInvoked: '/help',
        streaming: false,
        error: null,
        createdAt: Date.now(),
      };
      const botMsg: AIMessage = {
        id: randomId(),
        role: 'assistant',
        content: helpContent,
        commandInvoked: '/help',
        streaming: false,
        error: null,
        createdAt: Date.now() + 1,
      };
      setMessages((m) => [...m, sysMsg, botMsg]);
      setInput('');
      return;
    }

    let contextText: string | null = null;
    if (settings.contextConsent && cmd) {
      const currency = wallets.find((w) => !w.archived)?.currency ?? 'USD';
      contextText = packContext(wallets, records, currency);
    } else if (
      settings.contextConsent &&
      !cmd &&
      (input.toLowerCase().includes('report') ||
        input.toLowerCase().includes('spend') ||
        input.toLowerCase().includes('income'))
    ) {
      const currency = wallets.find((w) => !w.archived)?.currency ?? 'USD';
      contextText = packContext(wallets, records, currency);
    }

    const effectivePrompt = cmd
      ? cmd.buildPrompt(contextText)
      : contextText
        ? `${input.trim()}\n\nContext:\n${contextText}`
        : input.trim();

    const userMsg: AIMessage = {
      id: randomId(),
      role: 'user',
      content: input.trim(),
      commandInvoked: cmd ? cmd.id : null,
      streaming: false,
      error: null,
      createdAt: Date.now(),
    };
    const assistantMsg: AIMessage = {
      id: randomId(),
      role: 'assistant',
      content: '',
      commandInvoked: cmd ? cmd.id : null,
      streaming: true,
      error: null,
      createdAt: Date.now() + 1,
    };

    setMessages((m) => [...m, userMsg, assistantMsg]);
    setInput('');
    setShowCommands(false);
    setSending(true);

    abortRef.current = new AbortController();
    const history = [...messages, userMsg];
    const apiMessages = messagesForAPI(history);
    if (apiMessages.length > 0) {
      apiMessages[apiMessages.length - 1] = { role: 'user', content: effectivePrompt };
    }

    try {
      await streamChat({
        baseUrl: settings.baseUrl,
        model: settings.model,
        apiKey,
        messages: apiMessages,
        signal: abortRef.current.signal,
        onChunk: (text) => {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (!last || last.role !== 'assistant') return prev;
            return [...prev.slice(0, -1), { ...last, content: last.content + text }];
          });
        },
      });

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (!last) return prev;
        return [...prev.slice(0, -1), { ...last, streaming: false }];
      });
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (!last) return prev;
          return [...prev.slice(0, -1), { ...last, streaming: false }];
        });
      } else {
        const msg = err instanceof ChatError ? err.message : (err as Error).message;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (!last) return prev;
          return [...prev.slice(0, -1), { ...last, streaming: false, error: msg }];
        });
      }
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  };

  const stop = () => abortRef.current?.abort();

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-3xl">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h1 className="text-2xl font-semibold">AI Assistant</h1>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={clearChat} leftIcon={<Trash2 size={14} />}>
            Clear
          </Button>
          <Button variant="ghost" size="sm" onClick={onOpenSettings} leftIcon={<SettingsIcon size={14} />}>
            Settings
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 && (
          <div className="text-center text-dim text-sm py-12">
            <p>Ask anything about your finances.</p>
            <p className="text-xs text-mute mt-2">
              Type <code className="text-gold-400">/</code> to see commands, or ask a question directly.
            </p>
            <p className="text-xs text-mute mt-1">
              Chat is cleared when you close the tab. Save anything useful externally.
            </p>
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>

      <div className="relative glass-strong p-3 mt-3">
        {showCommands && (
          <CommandMenu
            query={input}
            onSelect={(cmd) => {
              setInput(cmd + ' ');
              setShowCommands(false);
            }}
            onClose={() => setShowCommands(false)}
          />
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Message the assistant… (type / for commands)"
            rows={1}
            maxLength={2000}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
              if (e.key === 'Escape') setShowCommands(false);
            }}
            className="flex-1 bg-transparent border-0 outline-none resize-none text-sm px-2 py-2 max-h-32"
          />
          {sending ? (
            <Button variant="danger" onClick={stop} leftIcon={<StopCircle size={14} />}>
              Stop
            </Button>
          ) : (
            <Button onClick={() => void send()} disabled={!input.trim()} leftIcon={<Send size={14} />}>
              Send
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
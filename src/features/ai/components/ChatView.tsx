import { useEffect, useRef, useState } from 'react';
import { Send, Trash2, Settings as SettingsIcon, StopCircle } from 'lucide-react';
import { Button, useToast } from '@/ui';
import { getDB } from '@/lib/db/idb';
import { getCachedKey } from '../lib/keyCache';
import { decryptString } from '../lib/crypto';
import { getAISettings } from '../lib/settings';
import { streamChat, messagesForAPI, ChatError } from '../lib/client';
import { randomId } from '@/lib/crypto/random';
import type { AIMessage, AISettings } from '@/lib/db/schema';
import MessageBubble from './MessageBubble';

type Props = {
  onOpenSettings: () => void;
  settings: AISettings;
};

export default function ChatView({ onOpenSettings, settings }: Props) {
  const toast = useToast();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
 
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void (async () => {
      const stored = await loadHistory();
      setMessages(stored);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async (): Promise<AIMessage[]> => {
    const db = await getDB();
    const all = await db.getAllFromIndex('ai_messages', 'by-created');
    return all;
  };

  const persist = async (m: AIMessage) => {
    const db = await getDB();
    await db.put('ai_messages', m);
  };

  const clearChat = async () => {
    const db = await getDB();
    await db.clear('ai_messages');
    setMessages([]);
  };

  const send = async () => {
    if (!settings || !input.trim() || sending) return;
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

    const userMsg: AIMessage = {
      id: randomId(),
      role: 'user',
      content: input.trim(),
      commandInvoked: null,
      streaming: false,
      error: null,
      createdAt: Date.now(),
    };
    const assistantMsg: AIMessage = {
      id: randomId(),
      role: 'assistant',
      content: '',
      commandInvoked: null,
      streaming: true,
      error: null,
      createdAt: Date.now() + 1,
    };

    setMessages((m) => [...m, userMsg, assistantMsg]);
    setInput('');
    setSending(true);
    await Promise.all([persist(userMsg), persist(assistantMsg)]);

    abortRef.current = new AbortController();
    const history = [...messages, userMsg];
    const apiMessages = messagesForAPI(history);

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
        const final = { ...last, streaming: false };
        void persist(final);
        return [...prev.slice(0, -1), final];
      });
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (!last) return prev;
          const final = { ...last, streaming: false };
          void persist(final);
          return [...prev.slice(0, -1), final];
        });
      } else {
        const msg = err instanceof ChatError ? err.message : (err as Error).message;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (!last) return prev;
          const final = { ...last, streaming: false, error: msg };
          void persist(final);
          return [...prev.slice(0, -1), final];
        });
      }
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  };

  const stop = () => abortRef.current?.abort();

  if (loading) return <div className="p-8 text-center text-dim text-sm">Loading chat…</div>;

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
            <p className="text-xs text-mute mt-2">Try: "How much did I spend last month?"</p>
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>

      <div className="glass-strong p-3 mt-3 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message the assistant…"
          rows={1}
          maxLength={2000}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
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
  );
}
import type { AIMessage } from '@/lib/db/schema';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type StreamOptions = {
  baseUrl: string;
  model: string;
  apiKey: string;
  messages: ChatMessage[];
  onChunk: (text: string) => void;
  signal?: AbortSignal;
};

export class ChatError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'ChatError';
  }
}

/**
 * Streams an OpenAI-compatible chat completion. Calls `onChunk` for each
 * incremental token. Resolves when the stream ends.
 */
export async function streamChat(opts: StreamOptions): Promise<void> {
  const url = `${opts.baseUrl.replace(/\/$/, '')}/chat/completions`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${opts.apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'FinX',
      },
      body: JSON.stringify({
        model: opts.model,
        messages: opts.messages,
        stream: true,
      }),
      signal: opts.signal,
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err;
    throw new ChatError(
      'Could not reach the AI provider. Check your connection and the base URL.',
    );
  }

  if (!res.ok) {
    const detail = await safeReadError(res);
    if (res.status === 401) {
      throw new ChatError('Invalid API key. Check your provider settings.', 401);
    }
    if (res.status === 429) {
      throw new ChatError('Rate limit or quota reached. Try again later or switch providers.', 429);
    }
    throw new ChatError(detail || `Provider error (${res.status}).`, res.status);
  }

  if (!res.body) throw new ChatError('Provider returned no response body.');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === '[DONE]') return;

      try {
        const json = JSON.parse(payload);
        const delta = json?.choices?.[0]?.delta?.content;
        if (typeof delta === 'string' && delta.length > 0) {
          opts.onChunk(delta);
        }
      } catch {
        // ignore malformed chunks — providers occasionally send keep-alives
      }
    }
  }
}

async function safeReadError(res: Response): Promise<string | null> {
  try {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      return json?.error?.message ?? text.slice(0, 200);
    } catch {
      return text.slice(0, 200);
    }
  } catch {
    return null;
  }
}

export function messagesForAPI(history: AIMessage[]): ChatMessage[] {
  return history
    .filter((m) => !m.streaming && !m.error && m.content.trim().length > 0)
    .map((m) => ({ role: m.role, content: m.content }));
}
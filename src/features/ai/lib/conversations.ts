import { getDB } from '@/lib/db/idb';
import { randomId } from '@/lib/crypto/random';
import type { AIConversation, AIMessage } from '@/lib/db/schema';

export async function listConversations(): Promise<AIConversation[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex('ai_conversations', 'by-updated');
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getConversation(id: string): Promise<AIConversation | null> {
  const db = await getDB();
  return (await db.get('ai_conversations', id)) ?? null;
}

export async function createConversation(title = 'New chat'): Promise<AIConversation> {
  const db = await getDB();
  const now = Date.now();
  const conv: AIConversation = {
    id: randomId(),
    title,
    createdAt: now,
    updatedAt: now,
  };
  await db.put('ai_conversations', conv);
  return conv;
}

export async function updateConversation(
  id: string,
  patch: Partial<Pick<AIConversation, 'title'>>,
): Promise<AIConversation | null> {
  const db = await getDB();
  const existing = await db.get('ai_conversations', id);
  if (!existing) return null;
  const next: AIConversation = {
    ...existing,
    ...patch,
    updatedAt: Date.now(),
  };
  await db.put('ai_conversations', next);
  return next;
}

export async function deleteConversation(id: string): Promise<void> {
  const db = await getDB();
  // Delete all messages in the conversation
  const tx = db.transaction(['ai_conversations', 'ai_messages'], 'readwrite');
  const msgStore = tx.objectStore('ai_messages');
  const msgIndex = msgStore.index('by-conversation');
  const msgs = await msgIndex.getAllKeys(id);
  for (const key of msgs) await msgStore.delete(key);
  await tx.objectStore('ai_conversations').delete(id);
  await tx.done;
}

export async function listMessages(conversationId: string): Promise<AIMessage[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex('ai_messages', 'by-conversation', conversationId);
  return all.sort((a, b) => a.createdAt - b.createdAt);
}

export async function saveMessage(msg: AIMessage): Promise<void> {
  const db = await getDB();
  await db.put('ai_messages', msg);
  // Bump conversation updatedAt so it floats to the top
  const conv = await db.get('ai_conversations', msg.conversationId);
  if (conv) {
    await db.put('ai_conversations', { ...conv, updatedAt: Date.now() });
  }
}

export async function deleteMessage(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('ai_messages', id);
}

export async function clearAllConversations(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['ai_conversations', 'ai_messages'], 'readwrite');
  await tx.objectStore('ai_conversations').clear();
  await tx.objectStore('ai_messages').clear();
  await tx.done;
}

/**
 * Derives a short title from the first user message in a conversation.
 * Used when a new conversation gets its first real message.
 */
export function deriveTitle(firstMessage: string): string {
  const cleaned = firstMessage.trim().replace(/\s+/g, ' ');
  if (cleaned.length <= 40) return cleaned;
  return cleaned.slice(0, 37) + '…';
}
import { getDB } from '@/lib/db/idb';
import type { AISettings } from '@/lib/db/schema';
import { DEFAULT_AI_SETTINGS, getPreset } from './providers';

export async function getAISettings(): Promise<AISettings> {
  const db = await getDB();
  const existing = await db.get('ai_settings', 'ai_settings');
  if (existing) return existing;
  const fresh = { ...DEFAULT_AI_SETTINGS, updatedAt: Date.now() };
  await db.put('ai_settings', fresh);
  return fresh;
}

export async function saveAISettings(patch: Partial<AISettings>): Promise<AISettings> {
  const db = await getDB();
  const existing = await getAISettings();
  const next: AISettings = { ...existing, ...patch, updatedAt: Date.now() };
  await db.put('ai_settings', next);
  return next;
}

export async function setProvider(id: AISettings['provider']): Promise<AISettings> {
  const preset = getPreset(id);
  return saveAISettings({
    provider: id,
    baseUrl: preset.baseUrl,
    model: preset.defaultModel,
  });
}

export async function clearApiKey(): Promise<AISettings> {
  return saveAISettings({ apiKeyCiphertext: null, apiKeyIv: null });
}

export async function hasApiKey(): Promise<boolean> {
  const settings = await getAISettings();
  return settings.apiKeyCiphertext !== null && settings.apiKeyIv !== null;
}
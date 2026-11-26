import type { AISettings } from '@/lib/db/schema';

export type ProviderPreset = {
  id: AISettings['provider'];
  label: string;
  baseUrl: string;
  defaultModel: string;
  hint: string;
  modelsUrl: string;
  signupUrl: string;
};

export const PROVIDERS: ProviderPreset[] = [
  {
    id: 'groq',
    label: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'openai/gpt-oss-120b',
    hint: 'Free tier available. Fast responses.',
    modelsUrl: 'https://console.groq.com/docs/models',
    signupUrl: 'https://console.groq.com/keys',
  },
  {
    id: 'gemini',
    label: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    defaultModel: 'gemini-2.0-flash',
    hint: 'Free tier available. Good for longer reports.',
    modelsUrl: 'https://ai.google.dev/gemini-api/docs/models',
    signupUrl: 'https://aistudio.google.com/apikey',
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'meta-llama/llama-3.3-70b-instruct:free',
    hint: 'Many free models. Choose one that fits your needs.',
    modelsUrl: 'https://openrouter.ai/models?max_price=0',
    signupUrl: 'https://openrouter.ai/keys',
  },
  {
    id: 'custom',
    label: 'Custom (OpenAI-compatible)',
    baseUrl: '',
    defaultModel: '',
    hint: 'Any endpoint that speaks the OpenAI chat-completions API.',
    modelsUrl: '',
    signupUrl: '',
  },
];

export function getPreset(id: AISettings['provider']): ProviderPreset {
  return PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0];
}

export const DEFAULT_AI_SETTINGS: AISettings = {
  id: 'ai_settings',
  provider: 'groq',
  baseUrl: PROVIDERS[0].baseUrl,
  model: PROVIDERS[0].defaultModel,
  apiKeyCiphertext: null,
  apiKeyIv: null,
  contextConsent: false,
  updatedAt: 0,
};
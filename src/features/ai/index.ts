export {
  deriveEncryptionKey,
  encryptString,
  decryptString,
} from './lib/crypto';
export {
  cacheKey,
  getCachedKey,
  clearCachedKey,
  hasKey,
} from './lib/keyCache';
export {
  PROVIDERS,
  DEFAULT_AI_SETTINGS,
  getPreset,
} from './lib/providers';
export type { ProviderPreset } from './lib/providers';
export {
  streamChat,
  messagesForAPI,
  ChatError,
} from './lib/client';
export type { ChatMessage } from './lib/client';
export {
  getAISettings,
  saveAISettings,
  setProvider,
  clearApiKey,
  hasApiKey,
} from './lib/settings';
export type { AISettings, AIMessage } from '@/lib/db/schema';
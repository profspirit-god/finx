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
export {
  COMMANDS,
  findCommand,
  packContext,
} from './lib/commands';
export type { CommandDefinition } from './lib/commands';
export type { AISettings, AIMessage } from '@/lib/db/schema';
export { default as AIPage } from './AIPage';
export {
  listConversations,
  getConversation,
  createConversation,
  updateConversation,
  deleteConversation,
  listMessages,
  saveMessage,
  deleteMessage,
  clearAllConversations,
  deriveTitle,
} from './lib/conversations';
export type { AIConversation } from '@/lib/db/schema';
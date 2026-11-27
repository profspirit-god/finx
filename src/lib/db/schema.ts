import type { User } from '@/types/user';
import type { Wallet } from '@/types/wallet';
import type { Record } from '@/types/record';
import type { Settings } from '@/types/settings';
import type { DBSchema } from 'idb';

export type StoredReceipt = {
  id: string;
  recordId: string;
  blob: Blob;
  mimeType: string;
  fileName: string;
  createdAt: number;
};

export type AISettings = {
  id: 'ai_settings';
  provider: 'groq' | 'gemini' | 'openrouter' | 'custom';
  baseUrl: string;
  model: string;
  apiKeyCiphertext: string | null;
  apiKeyIv: string | null;
  contextConsent: boolean;
  saveHistory: boolean;
  updatedAt: number;
};

export type AIConversation = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};

export type AIMessage = {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  commandInvoked: string | null;
  streaming: boolean;
  error: string | null;
  createdAt: number;
};

export interface FinXDB extends DBSchema {
  users: {
    key: string;
    value: User;
  };
  settings: {
    key: string;
    value: Settings;
  };
  wallets: {
    key: string;
    value: Wallet;
    indexes: { 'by-updated': number; 'by-type': string };
  };
  records: {
    key: string;
    value: Record;
    indexes: { 'by-wallet': string; 'by-created': number; 'by-occurred': number };
  };
  receipts: {
    key: string;
    value: StoredReceipt;
    indexes: { 'by-record': string };
  };
  ai_settings: {
    key: string;
    value: AISettings;
  };
  ai_conversations: {
    key: string;
    value: AIConversation;
    indexes: { 'by-updated': number };
  };
  ai_messages: {
    key: string;
    value: AIMessage;
    indexes: { 'by-conversation': string; 'by-created': number };
  };
}

export const DB_NAME = 'finx';
export const DB_VERSION = 3;
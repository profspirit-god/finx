export type Settings = {
  id: 'settings';
  theme: 'dark';
  currency: string;
  locale: string;
  aiProviderBaseUrl: string | null;
  aiApiKey: string | null;
  lastBackupAt: number | null;
  updatedAt: number;
};
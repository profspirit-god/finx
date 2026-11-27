import { useEffect, useState } from 'react';
import { Dialog, Skeleton } from '@/ui';
import { getAISettings, hasApiKey } from './lib/settings';
import AISettingsForm from './components/AISettingsForm';
import ChatView from './components/ChatView';
import type { AISettings } from '@/lib/db/schema';

export default function AIPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [configured, setConfigured] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const reload = async () => {
    const [s, has] = await Promise.all([getAISettings(), hasApiKey()]);
    setSettings(s);
    setConfigured(has);
    setLoading(false);
  };

  useEffect(() => {
    void reload();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3 max-w-3xl">
        <Skeleton width="40%" height={32} />
        <Skeleton width="100%" height={300} rounded="lg" />
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-semibold">AI Assistant</h1>
          <p className="text-sm text-dim mt-1">
            Connect an AI provider to use the assistant. Your API key is stored encrypted in this browser only.
          </p>
        </div>
        <div className="glass-strong p-5">
          <AISettingsForm
            onSaved={() => void reload()}
            onHistoryCleared={() => setRefreshKey((k) => k + 1)}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <ChatView
        key={refreshKey}
        onOpenSettings={() => setShowSettings(true)}
        settings={settings!}
        saveHistory={settings!.saveHistory}
      />
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        title="AI Settings"
        size="lg"
      >
        <div className="max-h-[70vh] overflow-y-auto pr-2 -mr-2">
          <AISettingsForm
            onClose={() => setShowSettings(false)}
            onSaved={() => {
              setShowSettings(false);
              void reload();
            }}
            onHistoryCleared={() => setRefreshKey((k) => k + 1)}
          />
        </div>
      </Dialog>
    </>
  );
}
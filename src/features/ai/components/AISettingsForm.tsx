import { useEffect, useState } from 'react';
import { ExternalLink, Eye, EyeOff, Save, X, Trash2, AlertTriangle } from 'lucide-react';
import { Button, Dialog, Input, Notice, Switch, useToast } from '@/ui';
import { getCachedKey } from '../lib/keyCache';
import { encryptString } from '../lib/crypto';
import { getPreset } from '../lib/providers';
import { getAISettings, saveAISettings } from '../lib/settings';
import { clearAllConversations } from '../lib/conversations';
import type { AISettings } from '@/lib/db/schema';
import ProviderSelector from './ProviderSelector';

type Props = {
  onClose?: () => void;
  onSaved?: () => void;
  onHistoryCleared?: () => void;
};

export default function AISettingsForm({ onClose, onSaved, onHistoryCleared }: Props) {
  const toast = useToast();
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    void getAISettings().then(setSettings);
  }, []);

  if (!settings) return null;

  const preset = getPreset(settings.provider);
  const hasKey = settings.apiKeyCiphertext !== null;

  const changeProvider = (id: AISettings['provider']) => {
    const next = getPreset(id);
    setSettings({ ...settings, provider: id, baseUrl: next.baseUrl, model: next.defaultModel });
  };

  const save = async () => {
    setError(null);
    if (!settings.baseUrl.trim() || !settings.model.trim()) {
      return setError('Base URL and model are required.');
    }

    let ciphertext = settings.apiKeyCiphertext;
    let iv = settings.apiKeyIv;

    if (apiKey.trim().length > 0) {
      const key = getCachedKey();
      if (!key) {
        return setError(
          'AI encryption key not available. Lock and unlock the app with your PIN to re-derive it.',
        );
      }
      try {
        const encrypted = await encryptString(apiKey.trim(), key);
        ciphertext = encrypted.ciphertext;
        iv = encrypted.iv;
      } catch (err) {
        return setError('Could not encrypt API key: ' + (err as Error).message);
      }
    }

    if (ciphertext === null) {
      return setError('Enter an API key to save.');
    }

    setSaving(true);
    try {
      await saveAISettings({
        ...settings,
        apiKeyCiphertext: ciphertext,
        apiKeyIv: iv,
      });
      toast.push({ variant: 'success', title: 'AI settings saved', message: 'You can now use the assistant.' });
      onSaved?.();
      onClose?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleClearHistory = async () => {
    setConfirmClear(false);
    await clearAllConversations();
    toast.push({ variant: 'success', title: 'History cleared', message: 'All saved chats deleted.' });
    onHistoryCleared?.();
  };

  return (
    <>
      <div className="space-y-5">
        {error && <Notice variant="error">{error}</Notice>}

        <ProviderSelector provider={settings.provider} onChange={changeProvider} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Base URL"
            value={settings.baseUrl}
            onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
            placeholder="https://api.provider.com/v1"
            hint={preset.signupUrl ? `Get API key: ${preset.label}` : undefined}
          />
          <Input
            label="Model"
            value={settings.model}
            onChange={(e) => setSettings({ ...settings, model: e.target.value })}
            placeholder="model-id"
            hint={preset.modelsUrl ? 'Check available models in your provider dashboard' : undefined}
          />
        </div>

        {preset.modelsUrl && (
          <a
            href={preset.modelsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300"
          >
            Browse available models <ExternalLink size={10} />
          </a>
        )}

        <div>
          <label className="block text-xs font-medium text-dim mb-1.5">
            API key {hasKey && <span className="text-[var(--sys-green)]">· already stored</span>}
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={hasKey ? '(leave blank to keep current key)' : 'gsk_...'}
                autoComplete="off"
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowKey((v) => !v)}
                    className="p-1 rounded text-dim hover:text-white"
                    aria-label={showKey ? 'Hide' : 'Show'}
                  >
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
              />
            </div>
          </div>
          <p className="text-xs text-mute mt-1">
            Stored encrypted in your browser. Never sent to any server except your AI provider.
          </p>
        </div>

        <div className="border-t border-[var(--line)] pt-4 space-y-4">
          <Switch
            checked={settings.contextConsent}
            onChange={(v) => setSettings({ ...settings, contextConsent: v })}
            label="Allow AI to read my financial summary"
            hint="Sends wallet names, balances, and recent transaction summaries to the AI. Enables commands like /report."
          />
          <Switch
            checked={settings.saveHistory}
            onChange={(v) => setSettings({ ...settings, saveHistory: v })}
            label="Save chat history to this device"
            hint="Keeps past conversations in the app. If off, chat clears when you close the tab."
          />

          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmClear(true)}
              leftIcon={<Trash2 size={14} />}
            >
              Clear all saved conversations
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {onClose && (
            <Button variant="ghost" leftIcon={<X size={14} />} onClick={onClose} disabled={saving}>
              Cancel
            </Button>
          )}
          <Button onClick={save} loading={saving} leftIcon={<Save size={14} />}>
            {saving ? 'Saving…' : 'Save settings'}
          </Button>
        </div>
      </div>

      <Dialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear all saved conversations?"
        description="Every saved chat will be permanently deleted. This cannot be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmClear(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleClearHistory}>Yes, clear everything</Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--sys-red)]/15 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} strokeWidth={1.75} className="text-[var(--sys-red)]" />
          </div>
          <p className="text-sm text-dim">
            Your AI settings (API key, provider, toggles) will be kept. Only the chat history is removed.
          </p>
        </div>
      </Dialog>
    </>
  );
}
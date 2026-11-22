import { useState } from 'react';
import { AlertTriangle, Check, Copy } from 'lucide-react';
import { Button, Dialog, Input, Notice, useToast } from '@/ui';
import { submitFeedback, FeedbackSubmitError } from '../submit';
import type { FeedbackType } from '../types';

type Props = {
  type: FeedbackType;
  open: boolean;
  onClose: () => void;
  defaultUsername?: string;
};

const LABELS: { [K in FeedbackType]: { title: string; description: string; placeholder: string; button: string } } = {
  bug: {
    title: 'Report a bug',
    description: 'Tell us what went wrong. The more detail, the better.',
    placeholder: 'What happened? What did you expect? Steps to reproduce if you can…',
    button: 'Send bug report',
  },
  idea: {
    title: 'Suggest an idea',
    description: 'What would make FinX better for you?',
    placeholder: 'Describe your idea. What problem does it solve?',
    button: 'Send suggestion',
  },
};

export default function FeedbackForm({ type, open, onClose, defaultUsername }: Props) {
  const toast = useToast();
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState(defaultUsername ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  const labels = LABELS[type];
  const len = message.trim().length;
  const canSubmit = len >= 10 && len <= 2000 && !submitting;

  const reset = () => {
    setMessage('');
    setError(null);
    setShowFallback(false);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    setShowFallback(false);
    try {
      await submitFeedback({ type, message, username });
      toast.push({
        variant: 'success',
        title: type === 'bug' ? 'Bug report sent' : 'Idea sent',
        message: 'Thanks — your feedback reached the developer.',
      });
      reset();
      onClose();
    } catch (err) {
      const msg = err instanceof FeedbackSubmitError ? err.message : 'Could not send. Please try again.';
      setError(msg);
      setShowFallback(true);
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = async () => {
    const text = `[FinX ${type}]\n${message}\n\nFrom: ${username || 'anonymous'}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.push({
        variant: 'success',
        title: 'Copied',
        message: 'Paste it into an email or message to the developer.',
      });
    } catch {
      toast.push({
        variant: 'error',
        title: 'Could not copy',
        message: 'Your browser blocked clipboard access.',
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={labels.title}
      description={labels.description}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={submit} loading={submitting} disabled={!canSubmit}>
            {submitting ? 'Sending…' : labels.button}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {error && (
          <Notice variant="error" title="Could not send">
            {error}
          </Notice>
        )}

        {showFallback && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-[var(--line)]">
            <AlertTriangle size={14} className="text-[var(--sys-orange)] shrink-0" />
            <p className="text-xs text-dim flex-1">
              Copy your message and send it manually to the developer.
            </p>
            <Button size="sm" variant="secondary" leftIcon={<Copy size={12} />} onClick={copyToClipboard}>
              Copy
            </Button>
          </div>
        )}

        <Input
          label="Your name (optional)"
          placeholder="Anonymous"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={80}
        />

        <div>
          <label htmlFor="feedback-message" className="block text-xs font-medium text-dim mb-1.5">
            Message
          </label>
          <textarea
            id="feedback-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={labels.placeholder}
            rows={6}
            maxLength={2000}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-[var(--line)] text-sm text-white placeholder:text-[var(--text-mute)] outline-none focus:border-gold-400 transition-colors resize-none"
          />
          <p className="text-xs text-mute mt-1">
            {len < 10 ? `${10 - len} more character${10 - len === 1 ? '' : 's'} needed` : `${len} / 2000`}
          </p>
        </div>

        <Notice variant="info">
          Your message, app version, and browser info will be sent to the developer. Wallets and records are never sent.
        </Notice>
      </div>
    </Dialog>
  );
}
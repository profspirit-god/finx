import { useEffect, useState } from 'react';
import { Bug, Lightbulb, MessageSquare, X } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuthStore } from '@/features/auth';
import FeedbackForm from './FeedbackForm';
import type { FeedbackType } from '../types';

const HIDDEN_PATHS = new Set(['/dev', '/dev-login', '/lock', '/onboarding']);

export default function FeedbackFab({ pathname }: { pathname: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formType, setFormType] = useState<FeedbackType | null>(null);
  const authState = useAuthStore((s) => s.state);
  const username = authState.status === 'unlocked' ? authState.user.displayName : '';

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (!isSupabaseConfigured()) return null;
  if (HIDDEN_PATHS.has(pathname)) return null;
  if (pathname.startsWith('/dev/')) return null;

  const pick = (type: FeedbackType) => {
    setFormType(type);
    setMenuOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex flex-col items-end gap-2">
        {menuOpen && (
          <div className="glass-strong p-2 flex flex-col gap-1 animate-slide-up">
            <button
              type="button"
              onClick={() => pick('bug')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10 transition-colors text-left"
            >
              <Bug size={16} strokeWidth={1.75} className="text-[var(--sys-red)]" />
              Report a bug
            </button>
            <button
              type="button"
              onClick={() => pick('idea')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10 transition-colors text-left"
            >
              <Lightbulb size={16} strokeWidth={1.75} className="text-[var(--sys-orange)]" />
              Suggest an idea
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close feedback menu' : 'Open feedback menu'}
          aria-expanded={menuOpen}
          className="w-12 h-12 rounded-full bg-gold-400 text-black shadow-gold flex items-center justify-center hover:bg-gold-300 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
        >
          {menuOpen ? <X size={20} strokeWidth={2} /> : <MessageSquare size={20} strokeWidth={2} />}
        </button>
      </div>

      {formType && (
        <FeedbackForm
          type={formType}
          open={!!formType}
          onClose={() => setFormType(null)}
          defaultUsername={username}
        />
      )}
    </>
  );
}
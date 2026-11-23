import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useNotices } from '../hooks/useNotices';
import NoticeDetailDialog from './NoticeDetailDialog';
import type { Notice } from '../types';

const SESSION_DISMISS_KEY = 'finx_notice_banner_hidden';

export default function DashboardNoticeBanner() {
  const { unread, dismiss, markRead } = useNotices();
  const [open, setOpen] = useState<Notice | null>(null);
  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  if (hidden || unread.length === 0) return null;
  const next = unread[0];

  const openNotice = () => {
    void markRead(next.id);
    setOpen(next);
  };

  const dismissBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHidden(true);
    try {
      sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openNotice}
        className="glass p-3 flex items-center gap-3 w-full text-left border border-gold-line hover:bg-white/[0.06] transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-gold-400/15 flex items-center justify-center shrink-0">
          <Bell size={16} strokeWidth={1.75} className="text-gold-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{next.title}</p>
          <p className="text-xs text-mute">New in v{next.version}</p>
        </div>
        <span
          onClick={dismissBanner}
          role="button"
          tabIndex={0}
          aria-label="Dismiss banner"
          className="p-1.5 rounded-lg text-dim hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setHidden(true);
              try {
                sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
              } catch {
                /* ignore */
              }
            }
          }}
        >
          <X size={14} />
        </span>
      </button>

      <NoticeDetailDialog
        notice={open}
        onClose={() => setOpen(null)}
        onDismiss={(id) => void dismiss(id)}
      />
    </>
  );
}
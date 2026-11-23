import { useState } from 'react';
import { Bell, Check, Dot } from 'lucide-react';
import { Button, EmptyState } from '@/ui';
import { useNotices } from '../hooks/useNotices';
import NoticeDetailDialog from './NoticeDetailDialog';
import type { Notice } from '../types';

const CATEGORY_LABEL: { [K in Notice['category']]: string } = {
  feature: 'Feature',
  fix: 'Fix',
  announcement: 'Announcement',
  maintenance: 'Maintenance',
};

const CATEGORY_COLOR: { [K in Notice['category']]: string } = {
  feature: 'text-[var(--sys-blue)] bg-[var(--sys-blue)]/15',
  fix: 'text-[var(--sys-green)] bg-[var(--sys-green)]/15',
  announcement: 'text-gold-400 bg-gold-400/15',
  maintenance: 'text-[var(--sys-orange)] bg-[var(--sys-orange)]/15',
};

export default function NoticesPage() {
  const { visible, read, unreadCount, markAllRead, dismiss, markRead } = useNotices();
  const [open, setOpen] = useState<Notice | null>(null);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Notices</h1>
          <p className="text-sm text-dim mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread ${unreadCount === 1 ? 'notice' : 'notices'}`
              : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" leftIcon={<Check size={14} />} onClick={() => void markAllRead()}>
            Mark all as read
          </Button>
        )}
      </div>

      {visible.length === 0 && (
        <EmptyState
          icon={<Bell size={22} strokeWidth={1.75} />}
          title="No notices"
          description="Announcements, new features, and fixes appear here when they ship."
        />
      )}

      {visible.length > 0 && (
        <div className="space-y-2">
          {visible.map((notice) => {
            const isUnread = !read.has(notice.id);
            return (
              <button
                key={notice.id}
                type="button"
                onClick={() => {
                  void markRead(notice.id);
                  setOpen(notice);
                }}
                className={[
                  'glass p-4 w-full text-left hover:bg-white/[0.06] transition-colors',
                  isUnread ? 'border-l-2 border-l-gold-400' : '',
                ].join(' ')}
              >
                <div className="flex items-start gap-3">
                  <div className={['text-[10px] font-medium px-2 py-0.5 rounded shrink-0 mt-0.5', CATEGORY_COLOR[notice.category]].join(' ')}>
                    {CATEGORY_LABEL[notice.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {isUnread && <Dot size={20} strokeWidth={4} className="text-gold-400 -ml-2" />}
                      <p className="text-sm font-medium truncate">{notice.title}</p>
                    </div>
                    <p className="text-xs text-dim mt-1 line-clamp-2">{notice.body}</p>
                    <p className="text-[11px] text-mute mt-1.5">
                      v{notice.version} ·{' '}
                      {new Date(notice.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <NoticeDetailDialog
        notice={open}
        onClose={() => setOpen(null)}
        onDismiss={(id) => void dismiss(id)}
      />
    </div>
  );
}
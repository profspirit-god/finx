import { Dialog, Button, Notice as NoticeBanner } from '@/ui';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Notice } from '../types';

const CATEGORY_TONE: { [K in Notice['category']]: 'info' | 'success' | 'warning' } = {
  feature: 'info',
  fix: 'success',
  announcement: 'info',
  maintenance: 'warning',
};

const CATEGORY_LABEL: { [K in Notice['category']]: string } = {
  feature: 'New feature',
  fix: 'Fix',
  announcement: 'Announcement',
  maintenance: 'Maintenance',
};

type Props = {
  notice: Notice | null;
  onClose: () => void;
  onDismiss?: (id: string) => void;
};

export default function NoticeDetailDialog({ notice, onClose, onDismiss }: Props) {
  if (!notice) return null;

  const tone = CATEGORY_TONE[notice.category];
  const label = CATEGORY_LABEL[notice.category];
  const date = new Date(notice.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Dialog
      open={!!notice}
      onClose={onClose}
      title={notice.title}
      description={`v${notice.version} · ${date} · ${label}`}
      footer={
        <>
          {notice.dismissable && onDismiss && (
            <Button variant="ghost" onClick={() => { onDismiss(notice.id); onClose(); }}>
              Dismiss
            </Button>
          )}
          {notice.actionHref && (
            <Link to={notice.actionHref} onClick={onClose}>
              <Button rightIcon={<ExternalLink size={14} />}>
                {notice.actionLabel ?? 'Open'}
              </Button>
            </Link>
          )}
          <Button variant={notice.actionHref ? 'ghost' : 'primary'} onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">{notice.body}</p>
      <div className="mt-4">
        <NoticeBanner variant={tone} title={label}>
          {label === 'New feature' && 'Something new in this version.'}
          {label === 'Fix' && 'A bug or issue was fixed.'}
          {label === 'Announcement' && 'Something worth knowing.'}
          {label === 'Maintenance' && 'Temporary changes or downtime.'}
        </NoticeBanner>
      </div>
    </Dialog>
  );
}
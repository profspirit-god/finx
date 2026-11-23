export type NoticeCategory = 'feature' | 'fix' | 'announcement' | 'maintenance';

export type Notice = {
  id: string;
  version: string;
  date: number;
  category: NoticeCategory;
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
  dismissable: boolean;
};

export type NoticeState = {
  read: string[];
  dismissed: string[];
  lastCheckedAt: number | null;
};
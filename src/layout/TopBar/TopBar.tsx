import { useLocation } from 'react-router-dom';
import OfflineBadge from './OfflineBadge';

const TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/wallets': 'Wallets',
  '/records': 'Records',
  '/data-tools': 'Data Tools',
  '/ai': 'AI Assistant',
  '/settings': 'Settings',
  '/help': 'Help',
};

export default function TopBar() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-20 h-[var(--topbar-h)] flex items-center px-4 md:px-6 glass border-x-0 border-t-0 rounded-none">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="md:hidden w-10" />
        <h1 className="text-base md:text-lg font-semibold truncate">
          {TITLES[pathname] ?? 'FinX'}
        </h1>
        <OfflineBadge />
      </div>
    </header>
  );
}
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Wallet, Receipt, Database, Sparkles, Settings, LifeBuoy, Menu, X, Bell,
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import { useNotices } from '@/features/notices';

type NavItem = {
  to: string;
  label: string;
  Icon: typeof LayoutDashboard;
  badgeKey?: 'notices';
};

const NAV: NavItem[] = [
  { to: '/dashboard',  label: 'Dashboard',    Icon: LayoutDashboard },
  { to: '/notices',    label: 'Notices',      Icon: Bell, badgeKey: 'notices' },
  { to: '/wallets',    label: 'Wallets',      Icon: Wallet },
  { to: '/records',    label: 'Records',      Icon: Receipt },
  { to: '/data-tools', label: 'Data Tools',   Icon: Database },
  { to: '/ai',         label: 'AI Assistant', Icon: Sparkles },
  { to: '/settings',   label: 'Settings',     Icon: Settings },
  { to: '/help',       label: 'Help',         Icon: LifeBuoy },
];

export default function Sidebar() {
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { unreadCount } = useNotices();
  const expanded = hovered;

  const badgeFor = (item: NavItem) =>
    item.badgeKey === 'notices' ? unreadCount : undefined;

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="md:hidden fixed top-3 left-3 z-50 glass w-10 h-10 flex items-center justify-center"
      >
        <Menu size={20} className="text-gold-400" />
      </button>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ type: 'tween', duration: 0.22 }}
            className="relative h-full w-[260px] glass-strong rounded-r-2xl p-4 flex flex-col gap-1"
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <Brand expanded />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={20} className="text-[var(--text-dim)]" />
              </button>
            </div>
            {NAV.map((item) => (
              <div key={item.to} onClick={() => setMobileOpen(false)}>
                <SidebarItem
                  to={item.to}
                  label={item.label}
                  Icon={item.Icon}
                  expanded
                  badge={badgeFor(item)}
                />
              </div>
            ))}
          </motion.aside>
        </div>
      )}

      <motion.aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{ width: expanded ? 240 : 68 }}
        transition={{ type: 'tween', duration: 0.2 }}
        className="hidden md:flex sticky top-0 h-screen z-30 flex-col glass rounded-none border-y-0 border-l-0 border-r border-[var(--line)] overflow-hidden"
      >
        <div className="h-[var(--topbar-h)] flex items-center px-3">
          <Brand expanded={expanded} />
        </div>
        <nav className="flex-1 p-2 flex flex-col gap-1">
          {NAV.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              label={item.label}
              Icon={item.Icon}
              expanded={expanded}
              badge={badgeFor(item)}
            />
          ))}
        </nav>
        <div className="p-3 text-[10px] text-mute">
          {expanded ? 'v1.6.0.0 — profspirit-god studio' : '©'}
        </div>
      </motion.aside>
    </>
  );
}

function Brand({ expanded }: { expanded: boolean }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-gold-400 font-semibold">
        FX
      </div>
      {expanded && <span className="text-sm font-semibold tracking-wide">FinX</span>}
    </div>
  );
}
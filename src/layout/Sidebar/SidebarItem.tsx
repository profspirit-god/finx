import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

type Props = {
  to: string;
  label: string;
  Icon: LucideIcon;
  expanded: boolean;
};

export default function SidebarItem({ to, label, Icon, expanded }: Props) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'group relative flex items-center gap-3 h-11 px-3 rounded-xl',
          'transition-colors duration-200',
          isActive
            ? 'text-gold-400 bg-[var(--gold-soft)]'
            : 'text-[var(--text-dim)] hover:text-white hover:bg-white/5',
        ].join(' ')
      }
    >
      <Icon size={20} strokeWidth={1.75} className="shrink-0" />
      <span
        className={[
          'whitespace-nowrap text-sm font-medium transition-opacity duration-200',
          expanded ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      >
        {label}
      </span>
    </NavLink>
  );
}
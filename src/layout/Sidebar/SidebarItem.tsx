import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

type Props = {
  to: string;
  label: string;
  Icon: LucideIcon;
  expanded: boolean;
  badge?: number;
};

export default function SidebarItem({ to, label, Icon, expanded, badge }: Props) {
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

      {/* Badge — renders unconditionally if badge > 0. If collapsed, it stays in bounds. */}
      {badge !== undefined && badge > 0 && (
        <span
          className={[
            'ml-auto min-w-[18px] h-[18px] rounded-full bg-gold-400 text-black text-[10px] font-bold flex items-center justify-center px-1',
            expanded ? 'flex' : 'hidden md:flex', // hide entirely on mobile/desktop collapsed if needed, but usually it's fine
          ].join(' ')}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </NavLink>
  );
}
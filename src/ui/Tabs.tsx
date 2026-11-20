import type { ReactNode } from 'react';

type Tab = { id: string; label: string; icon?: ReactNode };

type Props = {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
};

export function Tabs({ tabs, active, onChange, className = '' }: Props) {
  return (
    <div
      role="tablist"
      className={['flex items-center gap-1 p-1 rounded-xl glass', className].join(' ')}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={[
              'flex items-center gap-2 h-8 px-3 rounded-lg text-xs font-medium',
              'transition-colors duration-200',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400',
              isActive
                ? 'bg-gold-400 text-black'
                : 'text-dim hover:text-white hover:bg-white/5',
            ].join(' ')}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
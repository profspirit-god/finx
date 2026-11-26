import { PROVIDERS } from '../lib/providers';
import type { AISettings } from '@/lib/db/schema';

type Props = {
  provider: AISettings['provider'];
  onChange: (id: AISettings['provider']) => void;
};

export default function ProviderSelector({ provider, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-dim">Provider</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {PROVIDERS.map((p) => {
          const isActive = p.id === provider;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.id)}
              className={[
                'text-left p-3 rounded-xl border transition-colors',
                isActive
                  ? 'border-gold-400 bg-gold-400/10'
                  : 'border-[var(--line)] glass hover:bg-white/[0.05]',
              ].join(' ')}
            >
              <p className="text-sm font-medium">{p.label}</p>
              <p className="text-xs text-mute mt-1">{p.hint}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
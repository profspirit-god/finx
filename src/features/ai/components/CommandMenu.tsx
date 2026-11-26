import { COMMANDS } from '../lib/commands';

type Props = {
  query: string;
  onSelect: (command: string) => void;
  onClose: () => void;
};

export default function CommandMenu({ query, onSelect, onClose }: Props) {
  const filtered = COMMANDS.filter((c) =>
    c.id.toLowerCase().includes(query.toLowerCase().slice(1)),
  );

  if (filtered.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 glass-strong p-1 z-20 max-h-64 overflow-y-auto">
      {filtered.map((cmd) => (
        <button
          key={cmd.id}
          type="button"
          onClick={() => { onSelect(cmd.id); onClose(); }}
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <p className="text-sm font-mono text-gold-400">{cmd.label}</p>
          <p className="text-xs text-mute">{cmd.description}</p>
        </button>
      ))}
    </div>
  );
}
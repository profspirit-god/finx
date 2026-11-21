import { Switch } from '@/ui';
import { RECORD_FIELDS, type RecordField } from '../lib/schema';

type Props = { value: RecordField[]; onChange: (v: RecordField[]) => void };

export default function FieldPicker({ value, onChange }: Props) {
  const toggle = (key: RecordField) => {
    onChange(value.includes(key) ? value.filter((f) => f !== key) : [...value, key]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-medium text-dim">Fields</label>
        <button
          type="button"
          onClick={() => onChange(RECORD_FIELDS.map((f) => f.key))}
          className="text-[11px] text-gold-400 hover:text-gold-300"
        >
          Select all
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {RECORD_FIELDS.map((f) => (
          <Switch
            key={f.key}
            checked={value.includes(f.key)}
            onChange={() => toggle(f.key)}
            label={f.label}
          />
        ))}
      </div>
    </div>
  );
}
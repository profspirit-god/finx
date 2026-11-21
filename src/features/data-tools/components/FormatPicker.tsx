import { FileJson, FileSpreadsheet, FileText, File } from 'lucide-react';
import type { ExportFormat } from '../lib/schema';

type Props = { value: ExportFormat; onChange: (v: ExportFormat) => void };

const OPTIONS: { value: ExportFormat; label: string; hint: string; Icon: typeof File }[] = [
  { value: 'csv',  label: 'CSV',  hint: 'Spreadsheet-friendly, universal', Icon: FileText },
  { value: 'json', label: 'JSON', hint: 'Structured, developer-friendly',  Icon: FileJson },
  { value: 'xlsx', label: 'XLSX', hint: 'Excel workbook',                   Icon: FileSpreadsheet },
  { value: 'pdf',  label: 'PDF',  hint: 'Print-ready document',            Icon: FileText },
];

export default function FormatPicker({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-xs font-medium text-dim mb-2">Format</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {OPTIONS.map(({ value: v, label, hint, Icon }) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={[
              'flex flex-col items-start gap-1 p-3 rounded-xl text-left transition-colors',
              value === v
                ? 'bg-gold-400 text-black'
                : 'glass text-dim hover:text-white',
            ].join(' ')}
          >
            <Icon size={16} strokeWidth={1.75} />
            <span className="text-sm font-medium">{label}</span>
            <span className={`text-[11px] ${value === v ? 'text-black/70' : 'text-mute'}`}>
              {hint}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
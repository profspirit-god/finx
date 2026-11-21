import { useRef, useState } from 'react';
import { FileText, Upload, X } from 'lucide-react';
import { Button } from '@/ui';

type Props = {
  file: File | null;
  onChange: (file: File | null) => void;
};

export default function ReceiptUploader({ file, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePick = (f: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (f && f.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
    onChange(f);
  };

  if (file) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-[var(--line)]">
        {previewUrl ? (
          <img src={previewUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <FileText size={20} className="text-gold-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{file.name}</p>
          <p className="text-xs text-mute">{(file.size / 1024).toFixed(1)} KB</p>
        </div>
        <button
          type="button"
          onClick={() => handlePick(null)}
          className="p-1 rounded-lg text-dim hover:text-white hover:bg-white/5"
          aria-label="Remove receipt"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        leftIcon={<Upload size={16} strokeWidth={2} />}
        onClick={() => inputRef.current?.click()}
      >
        Attach receipt
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => handlePick(e.target.files?.[0] ?? null)}
      />
    </>
  );
}
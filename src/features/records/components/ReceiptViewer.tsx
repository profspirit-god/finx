import { useEffect, useState } from 'react';
import { FileText, Download, X } from 'lucide-react';
import { Button, Dialog } from '@/ui';
import { getReceipt } from '../api/receipts.repo';
import type { StoredReceipt } from '@/lib/db/schema';

export default function ReceiptViewer({ receiptId }: { receiptId: string }) {
  const [receipt, setReceipt] = useState<StoredReceipt | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const r = await getReceipt(receiptId);
      if (cancelled || !r) return;
      setReceipt(r);
      setUrl(URL.createObjectURL(r.blob));
    })();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [receiptId]);

  if (!receipt || !url) return null;
  const isImage = receipt.mimeType.startsWith('image/');

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="glass p-3 flex items-center gap-3 hover:bg-white/[0.06] transition-colors w-full text-left"
      >
        {isImage ? (
          <img src={url} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <FileText size={20} className="text-gold-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{receipt.fileName}</p>
          <p className="text-xs text-mute">Receipt attached</p>
        </div>
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={receipt.fileName}
        size="lg"
        footer={
          <a href={url} download={receipt.fileName}>
            <Button variant="secondary" leftIcon={<Download size={16} strokeWidth={2} />}>
              Download
            </Button>
          </a>
        }
      >
        {isImage ? (
          <img src={url} alt={receipt.fileName} className="w-full rounded-lg" />
        ) : (
          <iframe src={url} title={receipt.fileName} className="w-full h-[60vh] rounded-lg bg-white" />
        )}
      </Dialog>
    </>
  );
}
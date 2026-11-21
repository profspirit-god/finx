import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Pencil, Trash2, ArrowDownLeft, ArrowUpRight, ArrowRightLeft, SlidersHorizontal,
} from 'lucide-react';
import { Button, Dialog, Input, Notice, Select, Skeleton, useToast } from '@/ui';
import { ErrorPage } from '@/features/errors';
import { useRecordsStore } from '../state/records.store';
import { RECORD_CLASS_LABELS, type Record, type CashflowClass } from '@/types/record';
import { formatMinor, parseToMinor } from '@/lib/format/currency';
import { formatDateTime } from '@/lib/format/date';
import ReceiptViewer from './ReceiptViewer';
import { useWallets } from '@/features/wallets/hooks/useWallets';

const ICONS = {
  income: ArrowDownLeft,
  expense: ArrowUpRight,
  transfer: ArrowRightLeft,
  adjustment: SlidersHorizontal,
};

const TONE_CLASSES: { [K in CashflowClass]: string } = {
  income: 'text-[var(--sys-green)] bg-[var(--sys-green)]/15',
  expense: 'text-[var(--sys-red)] bg-[var(--sys-red)]/15',
  transfer: 'text-[var(--sys-blue)] bg-[var(--sys-blue)]/15',
  adjustment: 'text-[var(--sys-orange)] bg-[var(--sys-orange)]/15',
};

const CLASS_OPTIONS: { value: CashflowClass; label: string }[] = [
  { value: 'income', label: RECORD_CLASS_LABELS.income },
  { value: 'expense', label: RECORD_CLASS_LABELS.expense },
  { value: 'adjustment', label: RECORD_CLASS_LABELS.adjustment },
];

export default function RecordDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const records = useRecordsStore((s) => s.records);
  const getOne = useRecordsStore((s) => s.getOne);
  const update = useRecordsStore((s) => s.update);
  const remove = useRecordsStore((s) => s.remove);
  const { wallets } = useWallets();

  const [record, setRecord] = useState<Record | null>(
    records.find((r) => r.id === id) ?? null,
  );
  const [missing, setMissing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    void (async () => {
      const r = await getOne(id);
      if (r) {
        setRecord(r);
      } else {
        setMissing(true);
      }
    })();
  }, [id, getOne]);

  if (!id) return <ErrorPage code="URL2" />;

  if (missing) return <ErrorPage code="URL2" detail={`Record id: ${id}`} />;

  if (!record) {
    return (
      <div className="space-y-3 max-w-2xl">
        <Skeleton width={120} height={32} />
        <Skeleton width="60%" height={32} />
        <Skeleton width="40%" height={20} />
      </div>
    );
  }

  const wallet = wallets.find((w) => w.id === record.walletId);
  const Icon = ICONS[record.class];
  const sign =
    record.class === 'income' || record.class === 'adjustment'
      ? '+'
      : record.class === 'expense'
      ? '−'
      : '';

  const handleDelete = async () => {
    setBusy(true);
    await remove(record.id);
    setBusy(false);
    setConfirmDelete(false);
    toast.push({
      variant: 'success',
      title: 'Record deleted',
      message: record.transferPairId
        ? 'Both sides of the transfer were removed.'
        : 'The record was removed.',
    });
    navigate('/records');
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <Link to="/records">
        <Button variant="ghost" leftIcon={<ArrowLeft size={16} strokeWidth={2} />}>Back to records</Button>
      </Link>

      <div className="glass-strong p-5 space-y-4">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${TONE_CLASSES[record.class]}`}>
            <Icon size={24} strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-mute">{RECORD_CLASS_LABELS[record.class]}</p>
            <h1 className="text-xl font-semibold truncate">
              {record.counterparty || RECORD_CLASS_LABELS[record.class]}
            </h1>
            <p className="text-2xl font-semibold mt-1">
              {sign}
              {formatMinor(record.amountMinor, wallet?.currency ?? 'USD')}
            </p>
            {record.transferPairId && (
              <p className="text-xs text-[var(--sys-blue)] mt-1">Transfer (paired record)</p>
            )}
          </div>
        </div>

        {editing ? (
          <EditForm
            record={record}
            onCancel={() => setEditing(false)}
            onSave={async (patch) => {
              const updated = await update(record.id, patch);
              if (updated) {
                setRecord(updated);
                setEditing(false);
                toast.push({ variant: 'success', title: 'Record updated', message: 'Your changes were saved.' });
              }
            }}
          />
        ) : (
          <div className="space-y-2 text-sm">
            <Row label="Wallet" value={wallet?.name ?? 'Unknown'} />
            <Row label="Date" value={formatDateTime(record.occurredAt)} />
            {record.note && <Row label="Note" value={record.note} />}
            {record.tags.length > 0 && <Row label="Tags" value={record.tags.join(', ')} />}
            {record.transferPairId && (
              <Notice variant="info" title="Transfer">
                This record is one side of a transfer. Editing is disabled — delete and create a new transfer if you need to change it.
              </Notice>
            )}
          </div>
        )}

        {record.receiptId && <ReceiptViewer receiptId={record.receiptId} />}

        {!editing && (
          <div className="flex flex-wrap gap-2 pt-2">
            {!record.transferPairId && (
              <Button
                variant="secondary"
                leftIcon={<Pencil size={16} strokeWidth={2} />}
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            )}
            <Button
              variant="danger"
              leftIcon={<Trash2 size={16} strokeWidth={2} />}
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this record?"
        description={
          record.transferPairId
            ? 'This record is part of a transfer. Both sides will be deleted and wallet balances will be corrected.'
            : 'Wallet balance will be corrected automatically.'
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={busy}>
              {busy ? 'Deleting…' : 'Delete'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-dim">
          {sign}
          {formatMinor(record.amountMinor, wallet?.currency ?? 'USD')} · {wallet?.name ?? 'Unknown wallet'}
        </p>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-dim">{label}</span>
      <span className="text-right max-w-[60%] break-words">{value}</span>
    </div>
  );
}

function EditForm({
  record,
  onCancel,
  onSave,
}: {
  record: Record;
  onCancel: () => void;
  onSave: (patch: {
    amountMinor?: number;
    class?: CashflowClass;
    counterparty?: string;
    note?: string;
    tags?: string[];
    occurredAt?: number;
  }) => Promise<void>;
}) {
  const [amountRaw, setAmountRaw] = useState((record.amountMinor / 100).toString());
  const [cls, setCls] = useState<CashflowClass>(record.class);
  const [counterparty, setCounterparty] = useState(record.counterparty);
  const [note, setNote] = useState(record.note);
  const [tagsRaw, setTagsRaw] = useState(record.tags.join(', '));
  const [dateStr, setDateStr] = useState(new Date(record.occurredAt).toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const amount = parseToMinor(amountRaw);
    if (amount === null || amount <= 0) return setError('Enter a positive amount.');
    setError(null);
    setSaving(true);
    try {
      await onSave({
        amountMinor: amount,
        class: cls,
        counterparty: counterparty.trim(),
        note: note.trim(),
        tags: tagsRaw.split(',').map((t) => t.trim()).filter(Boolean),
        occurredAt: new Date(dateStr).getTime(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && <Notice variant="error">{error}</Notice>}
      <Select
        label="Class"
        value={cls}
        onChange={(e) => setCls(e.target.value as CashflowClass)}
        options={CLASS_OPTIONS}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Amount" value={amountRaw} onChange={(e) => setAmountRaw(e.target.value)} inputMode="decimal" />
        <Input label="Date" type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} />
      </div>
      <Input label="Counterparty" value={counterparty} onChange={(e) => setCounterparty(e.target.value)} />
      <Input label="Note" value={note} onChange={(e) => setNote(e.target.value)} />
      <Input label="Tags" value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} placeholder="comma-separated" />
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={onCancel} disabled={saving}>Cancel</Button>
        <Button onClick={submit} loading={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
      </div>
    </div>
  );
}
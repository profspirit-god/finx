import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, ArrowRightLeft, SlidersHorizontal } from 'lucide-react';
import { Button, Input, Select, useToast } from '@/ui';
import { useRecordsStore } from '../state/records.store';
import { useWalletsStore } from '@/features/wallets/state/wallets.store';
import type { CashflowClass } from '@/types/record';
import { RECORD_CLASS_LABELS } from '@/types/record';
import { formatMinor, parseToMinor } from '@/lib/format/currency';
import { saveReceipt } from '../api/receipts.repo';
import ReceiptUploader from './ReceiptUploader';

type Mode = 'standard' | 'transfer';

type Field = 'walletId' | 'fromWalletId' | 'toWalletId' | 'amount' | 'date';

const CLASS_OPTIONS: { value: CashflowClass; label: string; icon: typeof ArrowDownLeft }[] = [
  { value: 'income', label: RECORD_CLASS_LABELS.income, icon: ArrowDownLeft },
  { value: 'expense', label: RECORD_CLASS_LABELS.expense, icon: ArrowUpRight },
  { value: 'adjustment', label: RECORD_CLASS_LABELS.adjustment, icon: SlidersHorizontal },
];

export default function RecordForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const create = useRecordsStore((s) => s.create);
  const createTransfer = useRecordsStore((s) => s.createTransfer);
  const wallets = useWalletsStore((s) => s.wallets);

  const activeWallets = useMemo(() => wallets.filter((w) => !w.archived), [wallets]);

  const [mode, setMode] = useState<Mode>('standard');
  const [cls, setCls] = useState<CashflowClass>('expense');
  const [walletId, setWalletId] = useState('');
  const [fromWalletId, setFromWalletId] = useState('');
  const [toWalletId, setToWalletId] = useState('');
  const [amountRaw, setAmountRaw] = useState('');
  const [counterparty, setCounterparty] = useState('');
  const [note, setNote] = useState('');
  const [tagsRaw, setTagsRaw] = useState('');
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 10));
  const [receipt, setReceipt] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [saving, setSaving] = useState(false);

  // refs for scroll targets
  const walletRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const amountRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeWallets.length > 0 && !walletId) setWalletId(activeWallets[0].id);
    if (activeWallets.length > 0 && !fromWalletId) setFromWalletId(activeWallets[0].id);
    if (activeWallets.length > 1 && !toWalletId) setToWalletId(activeWallets[1].id);
  }, [activeWallets, walletId, fromWalletId, toWalletId]);

  const parsedAmount = amountRaw ? parseToMinor(amountRaw) : null;

  const scrollToField = (field: Field) => {
    const map: Record<Field, React.RefObject<HTMLDivElement>> = {
      walletId: walletRef,
      fromWalletId: fromRef,
      toWalletId: toRef,
      amount: amountRef,
      date: dateRef,
    };
    const el = map[field].current;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.animate(
        [
          { outline: '2px solid transparent', outlineOffset: '4px' },
          { outline: '2px solid var(--sys-red)', outlineOffset: '4px' },
          { outline: '2px solid transparent', outlineOffset: '4px' },
        ],
        { duration: 1400, easing: 'ease-out' },
      );
    }
  };

  const validate = (): Partial<Record<Field, string>> => {
    const e: Partial<Record<Field, string>> = {};
    if (activeWallets.length === 0) {
      e.walletId = 'Create a wallet first.';
      return e;
    }
    if (parsedAmount === null || parsedAmount <= 0) {
      e.amount = 'Enter a positive amount.';
    }
    if (!dateStr) {
      e.date = 'Pick a date.';
    }
    if (mode === 'transfer') {
      if (!fromWalletId) e.fromWalletId = 'Pick a source wallet.';
      if (!toWalletId) e.toWalletId = 'Pick a destination wallet.';
      if (fromWalletId && toWalletId && fromWalletId === toWalletId) {
        e.toWalletId = 'Source and destination must be different.';
      }
    } else if (!walletId) {
      e.walletId = 'Pick a wallet.';
    }
    return e;
  };

  const submit = async () => {
    const e = validate();
    setErrors(e);
    const firstError = Object.keys(e)[0] as Field | undefined;
    if (firstError) {
      scrollToField(firstError);
      const count = Object.keys(e).length;
      toast.push({
        variant: 'error',
        title: count === 1 ? 'Please fix one field' : `Please fix ${count} fields`,
        message: e[firstError] ?? 'Check the highlighted inputs.',
      });
      return;
    }
    setSaving(true);
    try {
      const occurredAt = new Date(dateStr).getTime();
      if (mode === 'transfer') {
        await createTransfer({
          fromWalletId,
          toWalletId,
          amountMinor: parsedAmount!,
          counterparty: '',
          note: note.trim(),
          occurredAt,
        });
      } else {
        const record = await create({
          walletId,
          amountMinor: parsedAmount!,
          class: cls,
          counterparty: counterparty.trim(),
          note: note.trim(),
          tags: tagsRaw
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          receiptId: null,
          occurredAt,
        });
        if (receipt) {
          const receiptId = await saveReceipt(receipt, record.id);
          await useRecordsStore.getState().update(record.id, { receiptId });
        }
      }
      toast.push({
        variant: 'success',
        title: 'Record saved',
        message: mode === 'transfer' ? 'Transfer created.' : 'Your record was saved.',
      });
      navigate('/records', { replace: true });
    } catch (err) {
      setSaving(false);
      toast.push({
        variant: 'error',
        title: "Couldn't save record",
        message: (err as Error).message || 'Please try again.',
      });
    }
  };

  if (activeWallets.length === 0) {
    return (
      <div className="space-y-4 max-w-xl">
        <Link to="/records">
          <Button variant="ghost" leftIcon={<ArrowLeft size={16} strokeWidth={2} />}>Back to records</Button>
        </Link>
        <div className="glass p-4 text-sm text-dim">
          You need at least one wallet before you can record money movements.
        </div>
        <Link to="/wallets/new">
          <Button>Create wallet</Button>
        </Link>
      </div>
    );
  }

  const walletOptions = activeWallets.map((w) => ({
    value: w.id,
    label: `${w.name} — ${formatMinor(w.currentBalanceMinor, w.currency)}`,
  }));

  return (
    <div className="space-y-4 max-w-xl pb-24">
      <Link to="/records">
        <Button variant="ghost" leftIcon={<ArrowLeft size={16} strokeWidth={2} />}>Back to records</Button>
      </Link>

      <h1 className="text-2xl font-semibold">New record</h1>

      <div className="glass-strong p-5 space-y-4">
        {/* Mode toggle */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/5">
          <button
            type="button"
            onClick={() => { setMode('standard'); setErrors({}); }}
            className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-sm transition-colors ${
              mode === 'standard' ? 'bg-gold-400 text-black' : 'text-dim hover:text-white'
            }`}
          >
            <ArrowDownLeft size={16} strokeWidth={2} />
            Income / Expense
          </button>
          <button
            type="button"
            onClick={() => { setMode('transfer'); setErrors({}); }}
            className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-sm transition-colors ${
              mode === 'transfer' ? 'bg-gold-400 text-black' : 'text-dim hover:text-white'
            }`}
          >
            <ArrowRightLeft size={16} strokeWidth={2} />
            Transfer
          </button>
        </div>

        {/* Class pills */}
        {mode === 'standard' && (
          <div>
            <label className="block text-xs font-medium text-dim mb-1.5">Class</label>
            <div className="flex gap-1 flex-wrap">
              {CLASS_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCls(value)}
                  className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs transition-colors ${
                    cls === value ? 'bg-gold-400 text-black' : 'glass text-dim hover:text-white'
                  }`}
                >
                  <Icon size={14} strokeWidth={2} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Wallet(s) */}
        {mode === 'standard' ? (
          <div ref={walletRef}>
            <Select
              label="Wallet"
              value={walletId}
              onChange={(e) => { setWalletId(e.target.value); setErrors((p) => ({ ...p, walletId: undefined })); }}
              options={walletOptions}
              error={errors.walletId}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div ref={fromRef}>
              <Select
                label="From wallet"
                value={fromWalletId}
                onChange={(e) => { setFromWalletId(e.target.value); setErrors((p) => ({ ...p, fromWalletId: undefined })); }}
                options={walletOptions}
                error={errors.fromWalletId}
              />
            </div>
            <div ref={toRef}>
              <Select
                label="To wallet"
                value={toWalletId}
                onChange={(e) => { setToWalletId(e.target.value); setErrors((p) => ({ ...p, toWalletId: undefined })); }}
                options={walletOptions}
                error={errors.toWalletId}
              />
            </div>
          </div>
        )}

        {/* Amount + date */}
        <div className="grid grid-cols-2 gap-3">
          <div ref={amountRef}>
            <Input
              label="Amount"
              placeholder="0.00"
              inputMode="decimal"
              value={amountRaw}
              onChange={(e) => { setAmountRaw(e.target.value); setErrors((p) => ({ ...p, amount: undefined })); }}
              hint={!errors.amount && parsedAmount ? formatMinor(parsedAmount, 'USD') : undefined}
              error={errors.amount}
            />
          </div>
          <div ref={dateRef}>
            <Input
              label="Date"
              type="date"
              value={dateStr}
              onChange={(e) => { setDateStr(e.target.value); setErrors((p) => ({ ...p, date: undefined })); }}
              error={errors.date}
            />
          </div>
        </div>

        {/* Counterparty + note */}
        {mode === 'standard' && (
          <Input
            label="Counterparty"
            placeholder="e.g. Grocery store, Employer, Friend"
            value={counterparty}
            onChange={(e) => setCounterparty(e.target.value)}
          />
        )}
        <Input
          label="Note"
          placeholder="Optional"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {mode === 'standard' && (
          <Input
            label="Tags"
            placeholder="comma-separated, e.g. food, monthly"
            value={tagsRaw}
            onChange={(e) => setTagsRaw(e.target.value)}
          />
        )}

        <div>
          <label className="block text-xs font-medium text-dim mb-2">Receipt</label>
          <ReceiptUploader file={receipt} onChange={setReceipt} />
        </div>
      </div>

      {/* Sticky action bar — always visible, no scrolling needed */}
      <div className="fixed bottom-0 left-0 right-0 md:left-[68px] z-20 glass border-t border-[var(--line)] p-3 flex items-center justify-end gap-2">
        <Link to="/records">
          <Button variant="ghost" type="button">Cancel</Button>
        </Link>
        <Button onClick={submit} loading={saving}>
          {saving ? 'Saving…' : 'Save record'}
        </Button>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Archive, Trash2, Banknote, Building2, Smartphone, TrendingUp, Wallet as WalletIcon,
} from 'lucide-react';
import { Button, Dialog, ErrorState, Skeleton } from '@/ui';
import { useWalletsStore } from '../state/wallets.store';
import { WALLET_TYPE_LABELS, type WalletType, type Wallet } from '@/types/wallet';
import { formatMinor } from '@/lib/format/currency';
import { formatDate } from '@/lib/format/date';
import WalletGoalBar from './WalletGoalBar';
import WalletAuditLog from './WalletAuditLog';

const ICONS: Record<WalletType, typeof WalletIcon> = {
  cash: Banknote,
  bank: Building2,
  'e-wallet': Smartphone,
  investment: TrendingUp,
  other: WalletIcon,
};

export default function WalletDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const wallets = useWalletsStore((s) => s.wallets);
  const refreshOne = useWalletsStore((s) => s.refreshOne);
  const archive = useWalletsStore((s) => s.archive);
  const remove = useWalletsStore((s) => s.remove);

  const wallet = wallets.find((w) => w.id === id);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!wallet && id) void refreshOne(id);
  }, [wallet, id, refreshOne]);

  if (!id) return <ErrorState title="Missing wallet id" />;

  if (!wallet) {
    return (
      <div className="space-y-3">
        <Skeleton width={120} height={32} />
        <Skeleton width="60%" height={24} />
        <Skeleton width="40%" height={48} />
      </div>
    );
  }

  if (wallet.archived) {
    return (
      <div className="space-y-4">
        <Link to="/wallets">
          <Button variant="ghost" leftIcon={<ArrowLeft size={16} strokeWidth={2} />}>Back to wallets</Button>
        </Link>
        <ErrorState
          title="This wallet is archived"
          description="Archived wallets are hidden from the list. Unarchive is coming in a later version."
        />
      </div>
    );
  }

  const Icon = ICONS[wallet.type];

  const handleArchive = async () => {
    setBusy(true);
    await archive(wallet.id);
    setBusy(false);
    navigate('/wallets');
  };

  const handleDelete = async () => {
    setBusy(true);
    await remove(wallet.id);
    setBusy(false);
    setConfirmDelete(false);
    navigate('/wallets');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Link to="/wallets">
        <Button variant="ghost" leftIcon={<ArrowLeft size={16} strokeWidth={2} />}>Back to wallets</Button>
      </Link>

      <WalletHeader wallet={wallet} Icon={Icon} />

      {wallet.targetAmountMinor !== null && <WalletGoalBar wallet={wallet} />}

      <MetaGrid wallet={wallet} />

      <WalletAuditLog walletId={wallet.id} />

      <div className="flex flex-wrap gap-2 pt-2">
        <Button
          variant="secondary"
          leftIcon={<Archive size={16} strokeWidth={2} />}
          onClick={handleArchive}
          disabled={busy}
        >
          Archive wallet
        </Button>
        <Button
          variant="danger"
          leftIcon={<Trash2 size={16} strokeWidth={2} />}
          onClick={() => setConfirmDelete(true)}
          disabled={busy}
        >
          Delete wallet
        </Button>
      </div>

      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this wallet?"
        description="This cannot be undone. Any records linked to this wallet will also be orphaned."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={busy}>
              {busy ? 'Deleting…' : 'Delete wallet'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-dim">
          Wallet: <strong className="text-white">{wallet.name}</strong>
        </p>
      </Dialog>
    </div>
  );
}

function WalletHeader({ wallet, Icon }: { wallet: Wallet; Icon: typeof WalletIcon }) {
  return (
    <div className="glass-strong p-5 flex items-start gap-4">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: `${wallet.color}22`, border: `1px solid ${wallet.color}55` }}
      >
        <Icon size={24} strokeWidth={1.75} style={{ color: wallet.color }} />
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-semibold truncate">{wallet.name}</h1>
        <p className="text-sm text-dim mt-0.5 truncate">
          {wallet.description || 'No description'}
        </p>
        <div className="mt-3">
          <p className="text-xs text-mute">Current balance</p>
          <p className="text-3xl font-semibold text-white">
            {formatMinor(wallet.currentBalanceMinor, wallet.currency)}
          </p>
        </div>
      </div>
    </div>
  );
}

function MetaGrid({ wallet }: { wallet: Wallet }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Meta label="Type" value={WALLET_TYPE_LABELS[wallet.type]} />
      <Meta label="Currency" value={wallet.currency} />
      <Meta label="Starting balance" value={formatMinor(wallet.startingBalanceMinor, wallet.currency)} />
      <Meta label="Created" value={formatDate(wallet.createdAt)} />
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass p-3">
      <p className="text-[11px] text-mute">{label}</p>
      <p className="text-sm font-medium text-white truncate mt-0.5">{value}</p>
    </div>
  );
}
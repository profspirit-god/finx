import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/ui';

export default function WalletDetail() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="space-y-4 p-8">
      <Link to="/wallets">
        <Button variant="ghost" leftIcon={<ArrowLeft size={16} strokeWidth={2} />}>Back to wallets</Button>
      </Link>
      <h1 className="text-2xl font-semibold">Wallet detail</h1>
      <p className="text-dim text-sm">Wallet {id} — full view arrives in Phase E.</p>
    </div>
  );
}
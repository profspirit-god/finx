import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/ui';

export default function RecordDetail() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="space-y-4 p-8">
      <Link to="/records">
        <Button variant="ghost" leftIcon={<ArrowLeft size={16} strokeWidth={2} />}>Back to records</Button>
      </Link>
      <h1 className="text-2xl font-semibold">Record detail</h1>
      <p className="text-dim text-sm">Record {id} — full view arrives in Phase D.</p>
    </div>
  );
}
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/ui';

export default function RecordForm() {
  return (
    <div className="space-y-4 p-8">
      <Link to="/records">
        <Button variant="ghost" leftIcon={<ArrowLeft size={16} strokeWidth={2} />}>Back to records</Button>
      </Link>
      <h1 className="text-2xl font-semibold">New record</h1>
      <p className="text-dim text-sm">Form arrives in Phase C.</p>
    </div>
  );
}
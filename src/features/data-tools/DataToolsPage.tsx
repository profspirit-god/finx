import { useState } from 'react';
import { Tabs } from '@/ui';
import ExportPanel from './components/ExportPanel';
import ImportPanel from './components/ImportPanel';

export default function DataToolsPage() {
  const [tab, setTab] = useState('export');

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold">Data Tools</h1>
        <p className="text-sm text-dim mt-1">Export and import your FinX data. Everything happens on-device.</p>
      </div>

      <Tabs
        tabs={[
          { id: 'export', label: 'Export' },
          { id: 'import', label: 'Import' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'export' && <ExportPanel />}
      {tab === 'import' && <ImportPanel />}
    </div>
  );
}
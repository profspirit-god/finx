import { useState } from 'react';
import {
  Button, Card, GlassPanel, Input, Select, Switch, Tabs,
  Tooltip, ProgressBar, EmptyState, Notice, Skeleton, SkeletonText,
  useToast,
} from '@/ui';
import { useDialog } from '@/app/providers/DialogProvider';
import { Info, Wallet } from 'lucide-react';

export default function DevUIPage() {
  const { push } = useToast();
  const dialog = useDialog();
  const [tab, setTab] = useState('one');
  const [sw, setSw] = useState(true);

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-2xl font-semibold">UI Smoke Test</h1>

      <Card title="Buttons" subtitle="Four variants, three sizes">
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </Card>

      <Card title="Inputs">
        <div className="space-y-3">
          <Input label="Name" placeholder="Enter a name" hint="A short hint" />
          <Input label="Error demo" placeholder="..." error="This field is required" />
          <Select
            label="Currency"
            placeholder="Pick one"
            options={[
              { value: 'usd', label: 'USD — US Dollar' },
              { value: 'php', label: 'PHP — Philippine Peso' },
              { value: 'eur', label: 'EUR — Euro' },
            ]}
          />
        </div>
      </Card>

      <Card title="Controls">
        <div className="space-y-3">
          <Switch checked={sw} onChange={setSw} label="Notifications" hint="Toggle me" />
          <Tabs
            tabs={[
              { id: 'one', label: 'One', icon: <Info size={14} /> },
              { id: 'two', label: 'Two', icon: <Wallet size={14} /> },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>
      </Card>

      <Card title="Feedback">
        <div className="space-y-3">
          <Notice variant="info" title="Info">Informational message</Notice>
          <Notice variant="success" title="Success">Saved successfully</Notice>
          <Notice variant="warning" title="Warning">Check your input</Notice>
          <Notice variant="error" title="Error">Something failed</Notice>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => push({ variant: 'success', title: 'Toasted', message: 'Everything is fine.' })}>
              Show toast
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                dialog.open({
                  title: 'Demo dialog',
                  description: 'This is a modal with provider state.',
                  content: <p className="text-sm text-dim">Dialog content goes here.</p>,
                  footer: <Button onClick={dialog.close}>Close</Button>,
                })
              }
            >
              Show dialog
            </Button>
            <Tooltip content="I'm a tooltip">
              <Button variant="ghost">Hover me</Button>
            </Tooltip>
          </div>
        </div>
      </Card>

      <Card title="Progress">
        <div className="space-y-3">
          <ProgressBar value={65} label="Savings goal" showPercent />
          <ProgressBar value={30} tone="green" label="Green tone" showPercent />
        </div>
      </Card>

      <Card title="Loading">
        <SkeletonText lines={3} />
        <div className="mt-4 flex gap-3">
          <Skeleton width={40} height={40} rounded="full" />
          <Skeleton width="60%" height={12} />
        </div>
      </Card>

      <Card title="Empty">
        <EmptyState
          title="No wallets yet"
          description="Wallets hold the money you want to track."
          action={<Button>Add wallet</Button>}
        />
      </Card>

      <GlassPanel className="p-4">
        <p className="text-sm text-dim">This is a glass panel.</p>
      </GlassPanel>
    </div>
  );
}
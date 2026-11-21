import { Tabs } from '@/ui';
import type { TimeRange } from '../lib/stats';

type Props = { value: TimeRange; onChange: (v: TimeRange) => void };

export default function TimeRangeSelector({ value, onChange }: Props) {
  return (
    <Tabs
      tabs={[
        { id: 'month', label: 'This month' },
        { id: '3months', label: 'Last 3 months' },
        { id: '6months', label: 'Last 6 months' },
        { id: 'year', label: 'This year' },
      ]}
      active={value}
      onChange={(id) => onChange(id as TimeRange)}
    />
  );
}
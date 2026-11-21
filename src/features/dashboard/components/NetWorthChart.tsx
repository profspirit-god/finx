import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatMinorCompact, formatMinor } from '@/lib/format/currency';
import type { NetWorthPoint } from '../lib/stats';

type Props = { data: NetWorthPoint[]; currency: string };

export default function NetWorthChart({ data, currency }: Props) {
  const chartData = data.map((p) => ({
    label: p.label,
    value: p.value / 100,
  }));

  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Net worth</h2>
        <p className="text-xs text-mute">Last {data.length} months</p>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="netWorthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5B800" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#F5B800" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="rgba(255,255,255,0.4)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.4)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatMinorCompact(Number(v) * 100, currency)}
              width={56}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(10,10,10,0.95)',
                border: '1px solid rgba(245,184,0,0.35)',
                borderRadius: 10,
                fontSize: 12,
              }}
              labelStyle={{ color: '#fff' }}
              formatter={(v) => [formatMinor(Number(v) * 100, currency), 'Net worth']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#F5B800"
              strokeWidth={2}
              fill="url(#netWorthFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
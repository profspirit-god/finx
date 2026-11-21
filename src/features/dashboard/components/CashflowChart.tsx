import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatMinorCompact, formatMinor } from '@/lib/format/currency';
import type { CashflowBucket } from '../lib/stats';

type Props = { data: CashflowBucket[]; currency: string };

export default function CashflowChart({ data, currency }: Props) {
  const chartData = data.map((b) => ({
    label: b.label,
    income: b.income / 100,
    expense: b.expense / 100,
  }));

  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Cashflow</h2>
        <p className="text-xs text-mute">Income vs expense</p>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
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
              formatter={(v, name) => [
                formatMinor(Number(v) * 100, currency),
                name === 'income' ? 'Income' : 'Expense',
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}
              iconType="circle"
            />
            <Bar dataKey="income" fill="#4ADE80" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#FF5C5C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatMinor } from '@/lib/format/currency';
import type { Wallet } from '@/types/wallet';

type Props = { wallets: Wallet[]; currency: string };

const COLORS = ['#F5B800', '#5CA8FF', '#4ADE80', '#FF9F45', '#A78BFA', '#FF5C5C'];

export default function InvestmentDonut({ wallets, currency }: Props) {
  const investments = wallets
    .filter((w) => !w.archived && w.type === 'investment' && w.currentBalanceMinor > 0)
    .map((w) => ({ name: w.name, value: w.currentBalanceMinor / 100 }));

  if (investments.length === 0) return null;

  const total = investments.reduce((s, x) => s + x.value, 0);

  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Investments</h2>
        <p className="text-xs text-mute">{formatMinor(total * 100, currency)} total</p>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={investments}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={2}
              stroke="none"
            >
              {investments.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'rgba(10,10,10,0.95)',
                border: '1px solid rgba(245,184,0,0.35)',
                borderRadius: 10,
                fontSize: 12,
              }}
              labelStyle={{ color: '#fff' }}
              formatter={(v) => formatMinor(Number(v) * 100, currency)}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
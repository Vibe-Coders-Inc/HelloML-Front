'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface AreaChartProps {
  data: ChartData[];
  color?: string;
  gradientId?: string;
}

export function AreaChartComponent({
  data,
  color = '#8B6F47',
  gradientId = 'colorValue',
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" opacity={0.5} />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#A67A5B', fontSize: 11 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#A67A5B', fontSize: 11 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #E8DCC8',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
          labelStyle={{ color: '#5D4E37', fontWeight: 600 }}
          itemStyle={{ color: '#8B6F47' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

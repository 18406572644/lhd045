import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useExperimentStore } from '../../store/useExperimentStore';

export interface BarChartDataPoint {
  name: string;
  [key: string]: number | string;
}

interface BarChartProps {
  data: BarChartDataPoint[];
  bars: {
    key: string;
    color: string;
    name: string;
  }[];
  xAxisKey?: string;
  height?: number;
  title?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  bars,
  xAxisKey = 'name',
  height = 250,
  title,
}) => {
  const { settings } = useExperimentStore();
  const isDark = settings.theme === 'dark';
  const axisColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? '#334155' : '#E2E8F0';

  return (
    <div>
      {title && (
        <div style={{ marginBottom: 8, fontWeight: 600, color: isDark ? '#F1F5F9' : '#1E293B' }}>
          {title}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 11, fill: axisColor }}
            stroke={axisColor}
          />
          <YAxis tick={{ fontSize: 11, fill: axisColor }} stroke={axisColor} />
          <Tooltip
            contentStyle={{
              background: isDark ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${gridColor}`,
              borderRadius: 8,
              color: isDark ? '#F1F5F9' : '#1E293B',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: axisColor }} />
          {bars.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              fill={bar.color}
              name={bar.name}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

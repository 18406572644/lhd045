import React from 'react';
import { useExperimentStore } from '../../store/useExperimentStore';

interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  label: string;
  color?: string;
  size?: number;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min,
  max,
  unit,
  label,
  color = '#1E6FBA',
  size = 140,
}) => {
  const { settings } = useExperimentStore();
  const isDark = settings.theme === 'dark';

  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const textColor = isDark ? '#F1F5F9' : '#1E293B';
  const subTextColor = isDark ? '#94A3B8' : '#64748B';
  const bgColor = isDark ? '#334155' : '#E2E8F0';

  let statusColor = color;
  if (percentage >= 90) {
    statusColor = '#EF4444';
  } else if (percentage >= 70) {
    statusColor = '#F59E0B';
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
      }}
    >
      <svg
        width={size}
        height={size / 2 + 20}
        viewBox={`0 0 ${size} ${size / 2 + 20}`}
      >
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={statusColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <text
          x={size / 2}
          y={size / 2 - 5}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="20"
          fontWeight="bold"
          fill={textColor}
        >
          {value.toFixed(1)}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11"
          fill={subTextColor}
        >
          {unit}
        </text>
      </svg>
      <div style={{ fontSize: 12, color: subTextColor, marginTop: 4 }}>{label}</div>
    </div>
  );
};

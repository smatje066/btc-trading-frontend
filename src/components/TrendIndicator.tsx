import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

export default function TrendIndicator({ trend }: TrendIndicatorProps) {
  const config = {
    BULLISH: {
      icon: TrendingUp,
      color: 'text-accent-green',
      bg: 'bg-accent-green/10',
      border: 'border-accent-green/20',
      label: 'BULLISH',
    },
    BEARISH: {
      icon: TrendingDown,
      color: 'text-accent-red',
      bg: 'bg-accent-red/10',
      border: 'border-accent-red/20',
      label: 'BEARISH',
    },
    NEUTRAL: {
      icon: Minus,
      color: 'text-gray-400',
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/20',
      label: 'NEUTRAL',
    },
  };

  const { icon: Icon, color, bg, border, label } = config[trend];

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${bg} ${border} border`}>
      <Icon className={color} size={20} />
      <span className={`font-semibold ${color}`}>{label}</span>
    </div>
  );
}

import { ArrowUp, ArrowDown, AlertTriangle, TrendingUp } from 'lucide-react';
import { TradeSignal } from '../types';

interface SignalCardProps {
  signal: TradeSignal;
}

export default function SignalCard({ signal }: SignalCardProps) {
  const isLong = signal.type === 'LONG';
  const borderColor = isLong ? 'border-accent-green' : 'border-accent-red';
  const bgColor = isLong ? 'bg-accent-green/10' : 'bg-accent-red/10';
  const textColor = isLong ? 'text-accent-green' : 'text-accent-red';
  const Icon = isLong ? ArrowUp : ArrowDown;

  return (
    <div className={`rounded-2xl p-6 border-2 ${borderColor} ${bgColor} ${isLong ? 'signal-long' : 'signal-short'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${isLong ? 'bg-accent-green' : 'bg-accent-red'}`}>
            <Icon className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              {isLong ? 'LONG SIGNAL' : 'SHORT SIGNAL'}
            </h3>
            <p className={`text-sm ${textColor}`}>
              Confidence: {signal.confidence.toFixed(0)}%
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Risk:Reward</p>
          <p className="text-xl font-bold text-white">1:{signal.riskRewardRatio}</p>
        </div>
      </div>

      {/* Trade Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-900/50 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Entry Price</p>
          <p className="text-lg font-bold">
            ${signal.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-dark-900/50 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Stop Loss</p>
          <p className="text-lg font-bold text-accent-red">
            ${signal.stopLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-dark-900/50 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Take Profit</p>
          <p className="text-lg font-bold text-accent-green">
            ${signal.takeProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-dark-900/50 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Potential P/L</p>
          <p className={`text-lg font-bold ${isLong ? 'text-accent-green' : 'text-accent-red'}`}>
            +{signal.potentialProfitPercent.toFixed(2)}% / {signal.potentialLossPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Analysis */}
      <div className="bg-dark-900/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={16} className="text-accent-blue" />
          <p className="text-sm font-semibold">Analysis</p>
        </div>
        <p className="text-sm text-gray-300">{signal.reason}</p>
      </div>

      {/* Warning */}
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        <AlertTriangle size={14} />
        <p>This is technical analysis only, not financial advice.</p>
      </div>
    </div>
  );
}

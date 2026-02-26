export interface SupportResistance {
  support: number[];
  resistance: number[];
  currentPrice: number;
  nearestSupport: number | null;
  nearestResistance: number | null;
}

export interface TradeSignal {
  type: 'LONG' | 'SHORT' | 'NEUTRAL';
  confidence: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  potentialProfitPercent: number;
  potentialLossPercent: number;
  reason: string;
}

export interface AnalysisResult {
  currentPrice: number;
  supportResistance: SupportResistance;
  movingAverages: {
    sma20: number;
    sma50: number;
    ema12: number;
    ema26: number;
  };
  rsi: number;
  signal: TradeSignal;
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  timestamp: string;
}

export interface UserSettings {
  tradeType: 'LONG' | 'SHORT' | 'BOTH';
  riskRewardRatio: number;
  confidenceThreshold: number;
  notificationsEnabled: boolean;
}

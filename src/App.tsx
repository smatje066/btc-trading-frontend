import { useState, useEffect } from 'react';
import { Bitcoin, Settings, Bell, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { getAnalysis, getSettings, updateSettings, testTelegram } from './api';
import { AnalysisResult, UserSettings } from './types';
import { TrendIndicator, SignalCard, SettingsPanel } from './components';

function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [analysisData, settingsData] = await Promise.all([
        getAnalysis(),
        getSettings(),
      ]);
      setAnalysis(analysisData);
      setSettings(settingsData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async (newSettings: Partial<UserSettings>) => {
    try {
      const updated = await updateSettings(newSettings);
      setSettings(updated);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const handleTestTelegram = async () => {
    try {
      await testTelegram();
      alert('Test notification sent!');
    } catch (error) {
      alert('Failed to send test notification');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-pulse text-accent-blue text-2xl font-bold">
          Loading BTC Trading Tool...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-600 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Bitcoin className="h-8 w-8 text-accent-yellow" />
              <h1 className="text-xl font-bold">BTC Trading Analysis</h1>
            </div>
            <nav className="flex gap-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'dashboard' ? 'bg-accent-blue text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Activity size={18} /> Dashboard
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'settings' ? 'bg-accent-blue text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Settings size={18} /> Settings
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' ? (
          <DashboardView analysis={analysis} lastUpdate={lastUpdate} />
        ) : (
          <SettingsPanel settings={settings} onUpdate={handleSettingsUpdate} onTestTelegram={handleTestTelegram} />
        )}
      </main>

      {/* Disclaimer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-xs text-gray-500 text-center">
          ⚠️ This is technical analysis only, not financial advice. Trade at your own risk.
        </p>
      </footer>
    </div>
  );
}

function DashboardView({
  analysis,
  lastUpdate,
}: {
  analysis: AnalysisResult | null;
  lastUpdate: Date;
}) {
  if (!analysis) {
    return (
      <div className="text-center py-12 text-gray-400">
        No analysis data available
      </div>
    );
  }

  const { currentPrice, trend, rsi, signal, supportResistance } = analysis;
  const isLongSignal = signal.type === 'LONG';
  const isShortSignal = signal.type === 'SHORT';

  return (
    <div className="space-y-6">
      {/* Price Header */}
      <div className="bg-dark-800 rounded-2xl p-6 border border-dark-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Current BTC Price</p>
            <h2 className="text-4xl font-bold mt-1">
              ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <TrendIndicator trend={trend} />
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Last updated: {lastUpdate.toLocaleString()}
        </p>
      </div>

      {/* Signal Card */}
      {(isLongSignal || isShortSignal) && signal.confidence >= 60 && (
        <SignalCard signal={signal} />
      )}

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* RSI */}
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-600">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-accent-blue" size={20} />
            <h3 className="font-semibold">RSI</h3>
          </div>
          <div className="text-3xl font-bold">{rsi.toFixed(1)}</div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Oversold</span>
              <span>Overbought</span>
            </div>
            <div className="relative h-2 bg-dark-600 rounded-full mt-1">
              <div
                className="absolute h-full bg-accent-blue rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(0, (rsi / 100) * 100))}%` }}
              />
            </div>
          </div>
          <p className={`text-sm mt-3 ${
            rsi < 30 ? 'text-accent-green' : rsi > 70 ? 'text-accent-red' : 'text-gray-400'
          }`}>
            {rsi < 30 ? 'Oversold - Potential Buy' : rsi > 70 ? 'Overbought - Potential Sell' : 'Neutral'}
          </p>
        </div>

        {/* Moving Averages */}
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-600">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-accent-green" size={20} />
            <h3 className="font-semibold">Moving Averages</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">EMA 12</span>
              <span>${analysis.movingAverages.ema12.toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">EMA 26</span>
              <span>${analysis.movingAverages.ema26.toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">SMA 20</span>
              <span>${analysis.movingAverages.sma20.toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between">
            <div className="flex justify-between">
              <span className="text-gray-400">SMA 50</span>
              <span>${analysis.movingAverages.sma50.toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>

        {/* Support/Resistance */}
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-600">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="text-accent-red" size={20} />
            <h3 className="font-semibold">Support & Resistance</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Resistance</p>
              {supportResistance.resistance.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {supportResistance.resistance.map((r, i) => (
                    <span key={i} className="px-2 py-1 bg-red-900/30 text-red-300 rounded text-xs">
                      ${r.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">None detected</span>
              )}
            </div>
            <div>
              <p className="text-gray-400 mb-1">Support</p>
              {supportResistance.support.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {supportResistance.support.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs">
                      ${s.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">None detected</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

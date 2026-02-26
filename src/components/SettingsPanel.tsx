import { Bell, Save } from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsPanelProps {
  settings: UserSettings | null;
  onUpdate: (settings: Partial<UserSettings>) => void;
  onTestTelegram: () => void;
}

export default function SettingsPanel({ settings, onUpdate, onTestTelegram }: SettingsPanelProps) {
  if (!settings) {
    return <div className="text-center py-12 text-gray-400">Loading settings...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Bell className="text-blue-500" size={24} />
          Trading Settings
        </h2>

        <div className="space-y-6">
          {/* Trade Type */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Trade Direction
            </label>
            <select
              value={settings.tradeType}
              onChange={(e) => onUpdate({ tradeType: e.target.value as 'LONG' | 'SHORT' | 'BOTH' })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="BOTH">Both LONG & SHORT</option>
              <option value="LONG">LONG only</option>
              <option value="SHORT">SHORT only</option>
            </select>
          </div>

          {/* Risk/Reward Ratio */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Risk : Reward Ratio (1:X)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              step="0.5"
              value={settings.riskRewardRatio}
              onChange={(e) => onUpdate({ riskRewardRatio: parseFloat(e.target.value) })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 1:2 or 1:3
            </p>
          </div>

          {/* Confidence Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Signal Confidence Threshold (%)
            </label>
            <input
              type="number"
              min="50"
              max="90"
              value={settings.confidenceThreshold}
              onChange={(e) => onUpdate({ confidenceThreshold: parseInt(e.target.value) })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
            <span className="text-gray-300">Enable Telegram Notifications</span>
            <button
              onClick={() => onUpdate({ notificationsEnabled: !settings.notificationsEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notificationsEnabled ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Test Telegram Button */}
          <button
            onClick={onTestTelegram}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Send Test Telegram Notification
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center mt-6">
        Changes are saved automatically. You will receive Telegram alerts when signals meet your criteria.
      </p>
    </div>
  );
}

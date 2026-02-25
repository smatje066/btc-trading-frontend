import axios from 'axios';
import { AnalysisResult, UserSettings } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getAnalysis(): Promise<AnalysisResult> {
  const response = await api.get('/btc/analysis');
  return response.data.data;
}

export async function getSettings(): Promise<UserSettings> {
  const response = await api.get('/settings');
  return response.data.data;
}

export async function updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
  const response = await api.post('/settings', settings);
  return response.data.data;
}

export async function testTelegram(): Promise<void> {
  await api.post('/telegram/test');
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressMap } from './srs';

const PROGRESS_KEY = 'mini_poliglota:progress:v1';
const STREAK_KEY = 'mini_poliglota:streak:v1';

export async function loadProgress(): Promise<ProgressMap> {
  const raw = await AsyncStorage.getItem(PROGRESS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function saveProgress(map: ProgressMap): Promise<void> {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
}

export interface StreakInfo {
  lastSessionDate: string | null; // YYYY-MM-DD
  currentStreak: number;
  totalSessions: number;
}

export async function loadStreak(): Promise<StreakInfo> {
  const raw = await AsyncStorage.getItem(STREAK_KEY);
  return raw ? JSON.parse(raw) : { lastSessionDate: null, currentStreak: 0, totalSessions: 0 };
}

export async function saveStreak(info: StreakInfo): Promise<void> {
  await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(info));
}

export function todayKey(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

export function registerSessionCompletion(prev: StreakInfo, now: number): StreakInfo {
  const today = todayKey(now);
  if (prev.lastSessionDate === today) return prev;
  const yesterday = todayKey(now - 24 * 60 * 60 * 1000);
  const currentStreak = prev.lastSessionDate === yesterday ? prev.currentStreak + 1 : 1;
  return { lastSessionDate: today, currentStreak, totalSessions: prev.totalSessions + 1 };
}

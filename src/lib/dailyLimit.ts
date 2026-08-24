import AsyncStorage from '@react-native-async-storage/async-storage';
import { todayKey } from './storage';

// Hard daily cap per the project spec: whichever limit hits first ends the
// day's practice — no way for the child to bypass it from inside the app.
export const MAX_WORDS_PER_DAY = 10;
export const MAX_MS_PER_DAY = 10 * 60 * 1000;

const DAILY_USAGE_KEY = 'mini_poliglota:daily_usage:v1';

export interface DailyUsage {
  day: string; // YYYY-MM-DD
  wordsAnswered: number;
  msSpent: number;
}

function emptyUsage(now: number): DailyUsage {
  return { day: todayKey(now), wordsAnswered: 0, msSpent: 0 };
}

export async function loadDailyUsage(now: number): Promise<DailyUsage> {
  const raw = await AsyncStorage.getItem(DAILY_USAGE_KEY);
  const parsed: DailyUsage | null = raw ? JSON.parse(raw) : null;
  if (!parsed || parsed.day !== todayKey(now)) return emptyUsage(now);
  return parsed;
}

export async function saveDailyUsage(usage: DailyUsage): Promise<void> {
  await AsyncStorage.setItem(DAILY_USAGE_KEY, JSON.stringify(usage));
}

export function addUsage(usage: DailyUsage, wordsAnswered: number, msSpent: number): DailyUsage {
  return { ...usage, wordsAnswered: usage.wordsAnswered + wordsAnswered, msSpent: usage.msSpent + msSpent };
}

export function isLockedOut(usage: DailyUsage): boolean {
  return usage.wordsAnswered >= MAX_WORDS_PER_DAY || usage.msSpent >= MAX_MS_PER_DAY;
}

export function remainingWords(usage: DailyUsage): number {
  return Math.max(0, MAX_WORDS_PER_DAY - usage.wordsAnswered);
}

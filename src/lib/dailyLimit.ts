import AsyncStorage from '@react-native-async-storage/async-storage';
import { todayKey } from './storage';

// The real daily cap is time, per the project spec — 10 minutes ends the
// day's practice, no way for the child to bypass it from inside the app.
// The word count is just a generous safety ceiling (in practice the clock
// always runs out first; this only guards against a pathological zero-
// latency loop), NOT a target to hit — buildDailySession() hands out far
// more words than could ever fit in 10 minutes, and time cuts it off.
export const MAX_MS_PER_DAY = 10 * 60 * 1000;
export const WORD_SAFETY_CAP = 300;

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
  return usage.msSpent >= MAX_MS_PER_DAY || usage.wordsAnswered >= WORD_SAFETY_CAP;
}

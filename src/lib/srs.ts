import { LanguageCode, WORD_BANK } from '../data/words';

// Leitner-box spaced repetition, tracked per (word, language) pair.
// Box 0 = never introduced. Box 1-5 = increasing review intervals.
// A word overdue by more than its own interval is treated as "forgotten"
// and dropped back to box 1 so it resurfaces with priority.

export type WordStatus = 'new' | 'learning' | 'known' | 'forgotten';

export interface WordProgress {
  box: number; // 0..5
  dueAt: number; // epoch ms
  lastSeenAt: number | null;
  correctCount: number;
  wrongCount: number;
  forgottenCount: number;
}

export type ProgressKey = `${string}:${LanguageCode}`;
export type ProgressMap = Record<ProgressKey, WordProgress>;

const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 16, 30];
const DAY_MS = 24 * 60 * 60 * 1000;

export function keyOf(wordId: string, lang: LanguageCode): ProgressKey {
  return `${wordId}:${lang}`;
}

export function emptyProgress(): WordProgress {
  return { box: 0, dueAt: 0, lastSeenAt: null, correctCount: 0, wrongCount: 0, forgottenCount: 0 };
}

/** Applies "forgotten" demotion for anything overdue, and returns the updated map. Pure. */
export function refreshForgotten(map: ProgressMap, now: number): ProgressMap {
  const next: ProgressMap = { ...map };
  for (const key of Object.keys(next) as ProgressKey[]) {
    const p = next[key];
    if (p.box <= 1 || !p.lastSeenAt) continue;
    const intervalMs = BOX_INTERVAL_DAYS[p.box] * DAY_MS;
    const overdueBy = now - (p.lastSeenAt + intervalMs);
    if (overdueBy > intervalMs) {
      next[key] = { ...p, box: 1, dueAt: now, forgottenCount: p.forgottenCount + 1 };
    }
  }
  return next;
}

export function statusOf(p: WordProgress | undefined): WordStatus {
  if (!p || p.box === 0) return 'new';
  if (p.forgottenCount > 0 && p.box <= 1) return 'forgotten';
  return p.box >= 4 ? 'known' : 'learning';
}

export function recordAnswer(map: ProgressMap, wordId: string, lang: LanguageCode, correct: boolean, now: number): ProgressMap {
  const key = keyOf(wordId, lang);
  const prev = map[key] ?? emptyProgress();
  let box = prev.box === 0 ? 1 : prev.box;
  box = correct ? Math.min(5, box + 1) : Math.max(1, box - 1);
  const dueAt = now + BOX_INTERVAL_DAYS[box] * DAY_MS;
  const updated: WordProgress = {
    box,
    dueAt,
    lastSeenAt: now,
    correctCount: prev.correctCount + (correct ? 1 : 0),
    wrongCount: prev.wrongCount + (correct ? 0 : 1),
    forgottenCount: prev.forgottenCount,
  };
  return { ...map, [key]: updated };
}

export interface SessionCard {
  wordId: string;
  lang: LanguageCode;
  reason: 'forgotten' | 'due' | 'new';
}

/**
 * Builds today's ~30-card session, split evenly across the 4 target
 * languages, prioritizing forgotten > overdue-review > brand new words.
 */
export function buildDailySession(
  map: ProgressMap,
  languages: LanguageCode[],
  now: number,
  totalCards = 30
): SessionCard[] {
  const perLanguage = Math.floor(totalCards / languages.length);
  const remainder = totalCards - perLanguage * languages.length;

  const session: SessionCard[] = [];

  languages.forEach((lang, idx) => {
    const slots = perLanguage + (idx < remainder ? 1 : 0);
    const candidates = WORD_BANK.map((w) => ({ word: w, progress: map[keyOf(w.id, lang)] }));

    const forgotten = candidates.filter((c) => statusOf(c.progress) === 'forgotten');
    const due = candidates.filter((c) => {
      const p = c.progress;
      return p && p.box > 0 && statusOf(p) !== 'forgotten' && p.dueAt <= now;
    });
    const fresh = candidates.filter((c) => statusOf(c.progress) === 'new');

    // Prioritize words that are most wrong / most overdue first.
    forgotten.sort((a, b) => (b.progress?.wrongCount ?? 0) - (a.progress?.wrongCount ?? 0));
    due.sort((a, b) => (a.progress?.dueAt ?? 0) - (b.progress?.dueAt ?? 0));

    const picked = [...forgotten, ...due, ...fresh].slice(0, slots);
    picked.forEach((c) => {
      const reason: SessionCard['reason'] =
        statusOf(c.progress) === 'forgotten' ? 'forgotten' : statusOf(c.progress) === 'new' ? 'new' : 'due';
      session.push({ wordId: c.word.id, lang, reason });
    });
  });

  return session;
}

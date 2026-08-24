import { LanguageCode, WORD_BANK } from '../data/words';

// SuperMemo-2 spaced repetition, tracked per (word, language) pair, adapted
// for binary (correct/incorrect) input per the project spec.

export type WordStatus = 'new' | 'learning' | 'known';

export interface WordProgress {
  interval: number; // days until next review
  repetition: number; // consecutive correct answers
  easeFactor: number; // starts at 2.5, per classic SM-2
  nextReviewAt: number; // epoch ms
  lastSeenAt: number | null;
  correctCount: number;
  wrongCount: number;
}

export type ProgressKey = `${string}:${LanguageCode}`;
export type ProgressMap = Record<ProgressKey, WordProgress>;

const DAY_MS = 24 * 60 * 60 * 1000;
const KNOWN_INTERVAL_DAYS = 21;

export function keyOf(wordId: string, lang: LanguageCode): ProgressKey {
  return `${wordId}:${lang}`;
}

export function emptyProgress(): WordProgress {
  return { interval: 0, repetition: 0, easeFactor: 2.5, nextReviewAt: 0, lastSeenAt: null, correctCount: 0, wrongCount: 0 };
}

export function statusOf(p: WordProgress | undefined): WordStatus {
  if (!p || p.lastSeenAt === null) return 'new';
  return p.interval >= KNOWN_INTERVAL_DAYS ? 'known' : 'learning';
}

/** Classic SM-2 update rule, adapted for a single correct/incorrect signal. */
function calculateNextReview(isCorrect: boolean, prev: WordProgress, now: number): WordProgress {
  let { interval, repetition, easeFactor } = prev;

  if (isCorrect) {
    if (repetition === 0) interval = 1;
    else if (repetition === 1) interval = 2;
    else interval = Math.round(interval * easeFactor);
    repetition += 1;
    easeFactor += 0.1;
  } else {
    repetition = 0;
    interval = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  }

  return {
    interval,
    repetition,
    easeFactor,
    nextReviewAt: now + interval * DAY_MS,
    lastSeenAt: now,
    correctCount: prev.correctCount + (isCorrect ? 1 : 0),
    wrongCount: prev.wrongCount + (isCorrect ? 0 : 1),
  };
}

export function recordAnswer(map: ProgressMap, wordId: string, lang: LanguageCode, correct: boolean, now: number): ProgressMap {
  const key = keyOf(wordId, lang);
  const prev = map[key] ?? emptyProgress();
  const updated = calculateNextReview(correct, prev, now);
  return { ...map, [key]: updated };
}

export interface SessionCard {
  wordId: string;
  lang: LanguageCode;
  reason: 'due' | 'new';
}

/**
 * Builds today's session, split evenly across the target languages,
 * prioritizing overdue reviews (most overdue first) before brand-new words.
 */
export function buildDailySession(map: ProgressMap, languages: LanguageCode[], now: number, totalCards = 10): SessionCard[] {
  const perLanguage = Math.floor(totalCards / languages.length);
  const remainder = totalCards - perLanguage * languages.length;

  const session: SessionCard[] = [];

  languages.forEach((lang, idx) => {
    const slots = perLanguage + (idx < remainder ? 1 : 0);
    if (slots <= 0) return;
    const candidates = WORD_BANK.map((w) => ({ word: w, progress: map[keyOf(w.id, lang)] }));

    const due = candidates.filter((c) => c.progress && c.progress.lastSeenAt !== null && c.progress.nextReviewAt <= now);
    const fresh = candidates.filter((c) => statusOf(c.progress) === 'new');

    due.sort((a, b) => (a.progress?.nextReviewAt ?? 0) - (b.progress?.nextReviewAt ?? 0));

    const picked = [...due, ...fresh].slice(0, slots);
    picked.forEach((c) => {
      const reason: SessionCard['reason'] = statusOf(c.progress) === 'new' ? 'new' : 'due';
      session.push({ wordId: c.word.id, lang, reason });
    });
  });

  return session;
}

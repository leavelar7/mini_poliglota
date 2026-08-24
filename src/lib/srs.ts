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

// Words per language before rotating to the next language, and how many
// times to go around that rotation. The daily session is capped by the
// 10-minute *time* budget (see dailyLimit.ts), not by how many cards exist
// here — this is deliberately oversized (round-robin across every language
// many times over) so the app never runs out of words before the clock
// does. Whoever answers faster/more accurately naturally gets further
// through it in 10 minutes; that's the "adapts to the user" behavior.
const ROUND_BLOCK_SIZE = 4;
const MAX_ROUNDS = 60;

/**
 * Builds a long, round-robin queue of cards cycling through every target
 * language in blocks of ROUND_BLOCK_SIZE, prioritizing overdue reviews
 * (most overdue first) before brand-new words, within each language. The
 * caller consumes from this queue until the time budget runs out.
 */
export function buildDailySession(map: ProgressMap, languages: LanguageCode[], now: number): SessionCard[] {
  const pools = new Map<LanguageCode, { wordId: string; reason: SessionCard['reason'] }[]>();

  for (const lang of languages) {
    const candidates = WORD_BANK.map((w) => ({ word: w, progress: map[keyOf(w.id, lang)] }));
    const due = candidates.filter((c) => c.progress && c.progress.lastSeenAt !== null && c.progress.nextReviewAt <= now);
    const fresh = candidates.filter((c) => statusOf(c.progress) === 'new');
    due.sort((a, b) => (a.progress?.nextReviewAt ?? 0) - (b.progress?.nextReviewAt ?? 0));
    pools.set(
      lang,
      [...due, ...fresh].map((c) => ({ wordId: c.word.id, reason: statusOf(c.progress) === 'new' ? 'new' : ('due' as const) }))
    );
  }

  const session: SessionCard[] = [];
  const cursor = new Map<LanguageCode, number>(languages.map((l) => [l, 0]));

  for (let round = 0; round < MAX_ROUNDS; round++) {
    let addedAny = false;
    for (const lang of languages) {
      const pool = pools.get(lang) ?? [];
      const start = cursor.get(lang) ?? 0;
      const slice = pool.slice(start, start + ROUND_BLOCK_SIZE);
      slice.forEach((c) => session.push({ wordId: c.wordId, lang, reason: c.reason }));
      cursor.set(lang, start + slice.length);
      if (slice.length > 0) addedAny = true;
    }
    if (!addedAny) break; // every language ran out of due + new words
  }

  return session;
}

// Scores how close a speech-recognition transcript is to a target word.
// Pure and platform-independent so it can be unit-tested without a device.

// NFD decomposes accented letters into base letter + combining mark (café ->
// cafe + ´), so stripping everything outside a-z/whitespace below also
// strips the accent — no separate diacritic-removal step needed.

function normalizeWord(s: string): string {
  return s.normalize('NFD').toLowerCase().replace(/[^a-z]/g, '');
}

function tokenize(s: string): string[] {
  return s
    .normalize('NFD')
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

export interface MatchResult {
  correct: boolean;
  similarity: number; // 0..1, best match across every word the recognizer heard
  heardWord: string | null; // whichever recognized word scored best
}

/**
 * The recognizer often returns a short phrase ("the sun", "sun!") rather than
 * a bare word, so we score every word it heard against the target and keep
 * the best match — not the whole phrase — before deciding correct/wrong.
 * Shorter target words need a tighter match: a 1-letter slip on a 3-letter
 * word is a much bigger relative error than the same slip on "elephant".
 */
export function scorePronunciation(transcript: string, target: string): MatchResult {
  const targetNorm = normalizeWord(target);
  const heardWords = tokenize(transcript);
  if (!targetNorm || heardWords.length === 0) {
    return { correct: false, similarity: 0, heardWord: null };
  }

  let best = { similarity: -1, word: heardWords[0] };
  for (const word of heardWords) {
    const distance = levenshtein(word, targetNorm);
    const similarity = 1 - distance / Math.max(word.length, targetNorm.length, 1);
    if (similarity > best.similarity) best = { similarity, word };
  }

  const threshold = targetNorm.length <= 3 ? 0.8 : targetNorm.length <= 5 ? 0.7 : 0.6;
  return { correct: best.similarity >= threshold, similarity: best.similarity, heardWord: best.word };
}

// Scores how close a speech-recognition transcript is to a target word (or
// short phrase, e.g. a German noun with its article — "die Sonne"). Pure and
// platform-independent so it can be unit-tested without a device.

// NFD decomposes accented letters into base letter + combining mark (café ->
// cafe + ´), so stripping everything outside a-z/whitespace below also
// strips the accent — no separate diacritic-removal step needed.

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

function similarityOf(a: string, b: string): number {
  if (!a || !b) return 0;
  const distance = levenshtein(a, b);
  return 1 - distance / Math.max(a.length, b.length, 1);
}

function thresholdFor(normLength: number): number {
  return normLength <= 3 ? 0.8 : normLength <= 5 ? 0.7 : 0.6;
}

export interface MatchResult {
  correct: boolean;
  similarity: number; // 0..1, best match found
  heardWord: string | null; // whichever recognized phrase scored best
}

/**
 * The recognizer often returns a short phrase ("the sun", "sun!") rather than
 * a bare word, so we score every plausible span it heard against the target
 * and keep the best match — not the whole raw transcript — before deciding
 * correct/wrong. Shorter targets need a tighter match: a 1-letter slip on a
 * 3-letter word is a much bigger relative error than the same slip on
 * "elephant".
 *
 * Targets can be multi-word (German nouns carry their article, e.g. "die
 * Sonne", so the child learns the correct gender from day one). We first try
 * to match the full phrase using a same-length sliding window over what was
 * heard — but a 5-year-old (or the recognizer) easily drops the quiet,
 * unstressed article, so saying just the noun also counts as correct.
 */
export function scorePronunciation(transcript: string, target: string): MatchResult {
  const targetWords = tokenize(target);
  const heardWords = tokenize(transcript);
  if (targetWords.length === 0 || heardWords.length === 0) {
    return { correct: false, similarity: 0, heardWord: null };
  }

  const targetPhrase = targetWords.join('');
  let best = { similarity: -1, phrase: heardWords[0], compareLength: targetPhrase.length };

  // Full-phrase match: any consecutive span of the same word-count as the target.
  for (let i = 0; i + targetWords.length <= heardWords.length; i++) {
    const window = heardWords.slice(i, i + targetWords.length);
    const similarity = similarityOf(window.join(''), targetPhrase);
    if (similarity > best.similarity) best = { similarity, phrase: window.join(' '), compareLength: targetPhrase.length };
  }

  // Noun-only fallback: dropping a leading article ("Sonne" for "die Sonne")
  // is still a correct pronunciation of the word itself.
  if (targetWords.length > 1) {
    const nounOnly = targetWords[targetWords.length - 1];
    for (const word of heardWords) {
      const similarity = similarityOf(word, nounOnly);
      if (similarity > best.similarity) best = { similarity, phrase: word, compareLength: nounOnly.length };
    }
  }

  const threshold = thresholdFor(best.compareLength);
  return { correct: best.similarity >= threshold, similarity: best.similarity, heardWord: best.phrase };
}

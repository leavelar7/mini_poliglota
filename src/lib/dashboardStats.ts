import { LANGUAGES, LanguageCode } from '../data/words';

export interface ProgressEntry {
  wordId: string;
  lang: LanguageCode;
  box: number;
  correctCount: number;
  wrongCount: number;
  forgottenCount: number;
}

export interface LanguageStat {
  lang: LanguageCode;
  known: number;
  learning: number;
  introduced: number;
}

export interface WeakWord {
  wordId: string;
  lang: LanguageCode;
  wrongCount: number;
  correctCount: number;
  accuracy: number;
}

function entryStatus(e: ProgressEntry): 'new' | 'learning' | 'known' | 'forgotten' {
  if (e.box === 0) return 'new';
  if (e.forgottenCount > 0 && e.box <= 1) return 'forgotten';
  return e.box >= 4 ? 'known' : 'learning';
}

export function computeLanguageStats(entries: ProgressEntry[]): LanguageStat[] {
  return LANGUAGES.map((lang) => {
    const forLang = entries.filter((e) => e.lang === lang);
    const known = forLang.filter((e) => entryStatus(e) === 'known').length;
    const learning = forLang.filter((e) => {
      const s = entryStatus(e);
      return s === 'learning' || s === 'forgotten';
    }).length;
    return { lang, known, learning, introduced: forLang.length };
  });
}

export function computeWeakWords(entries: ProgressEntry[], limit = 10): WeakWord[] {
  return entries
    .filter((e) => e.wrongCount > 0)
    .map((e) => {
      const total = e.correctCount + e.wrongCount;
      return {
        wordId: e.wordId,
        lang: e.lang,
        wrongCount: e.wrongCount,
        correctCount: e.correctCount,
        accuracy: total > 0 ? e.correctCount / total : 1,
      };
    })
    .sort((a, b) => a.accuracy - b.accuracy || b.wrongCount - a.wrongCount)
    .slice(0, limit);
}

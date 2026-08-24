import * as Speech from 'expo-speech';
import { LanguageCode } from '../data/words';

// expo-speech's `language` option alone isn't always enough to force a
// native-sounding voice — some platforms silently fall back to the default
// (often English) voice if no voice identifier is given. We look up the
// device's actual installed voices and pin one explicitly per language.

let voicesPromise: Promise<Speech.Voice[]> | null = null;

function loadVoices(): Promise<Speech.Voice[]> {
  if (!voicesPromise) {
    voicesPromise = Speech.getAvailableVoicesAsync().catch(() => [] as Speech.Voice[]);
  }
  return voicesPromise;
}

// Preferred country variant per language, so playback sounds like a native
// speaker of that specific accent (e.g. France French, not Québécois).
const PREFERRED_LOCALE: Record<LanguageCode, string> = {
  en: 'en-us',
  fr: 'fr-fr',
  it: 'it-it',
  de: 'de-de',
};

const voiceCache: Partial<Record<LanguageCode, string | null>> = {};

export async function pickVoice(lang: LanguageCode): Promise<string | undefined> {
  if (lang in voiceCache) return voiceCache[lang] ?? undefined;

  const voices = await loadVoices();
  const preferred = PREFERRED_LOCALE[lang];
  const prefix = lang; // 'en' | 'fr' | 'it' | 'de'

  const exact = voices.find((v) => v.language?.toLowerCase() === preferred);
  const sameLanguage = voices.find((v) => v.language?.toLowerCase().startsWith(prefix));
  const identifier = exact?.identifier ?? sameLanguage?.identifier ?? null;

  voiceCache[lang] = identifier;
  return identifier ?? undefined;
}

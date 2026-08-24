import { ANIMALS_1 } from './wordbank/animals1';
import { ANIMALS_2 } from './wordbank/animals2';
import { BODY_FAMILY } from './wordbank/body_family';
import { HOUSE } from './wordbank/house';
import { KITCHEN_FRUITS } from './wordbank/kitchen_fruits';
import { FOOD_VEGETABLES } from './wordbank/food_veg_other';
import { CLOTHES } from './wordbank/clothes_colors_numbers';
import { NATURE_WEATHER_PLANTS } from './wordbank/nature_weather_plants';
import { TRANSPORT_PROFESSIONS } from './wordbank/transport_professions';
import { SCHOOL_TOYS_SPORTS } from './wordbank/school_toys_sports';
import { MUSIC_EMOTIONS_TIME } from './wordbank/music_emotions_time';
import { PLACES_TECH_TOOLS } from './wordbank/places_tech_tools';
import { HYGIENE_FARM_SPACE } from './wordbank/hygiene_farm_space';
import { VERBS_1 } from './wordbank/verbs1';
import { VERBS_2 } from './wordbank/verbs2';
import { ADJECTIVES } from './wordbank/adjectives';
import { HOLIDAYS_MATERIALS } from './wordbank/holidays_materials';
import { FOOD_EXTRA } from './wordbank/food_extra';
import { POSITIONS_ORDINALS_EXTRA } from './wordbank/positions_ordinals_extra';
import { HOUSEHOLD_MISC } from './wordbank/household_misc';
import { FINAL_BATCH } from './wordbank/final_batch';
import { TOP_UP } from './wordbank/top_up';

export type LanguageCode = 'en' | 'es' | 'it' | 'de';

export const LANGUAGES: LanguageCode[] = ['en', 'es', 'it', 'de'];

export const TTS_LOCALE: Record<LanguageCode, string> = {
  en: 'en-US',
  es: 'es-ES',
  it: 'it-IT',
  de: 'de-DE',
};

export interface WordEntry {
  id: string;
  category: string;
  emoji: string;
  pt: string;
  translations: Record<LanguageCode, string>;
}

// Core 41 words — these are the ones with hand-drawn illustrations in
// src/illustrations (WordIllustration falls back to emoji for everything
// else). German nouns carry their article (der/die/das) so the correct
// grammatical gender is learned along with the word from day one.
const CORE_WORDS: WordEntry[] = [
  { id: 'sun', category: 'natureza', emoji: '☀️', pt: 'sol', translations: { en: 'sun', es: 'sol', it: 'sole', de: 'die Sonne' } },
  { id: 'moon', category: 'natureza', emoji: '🌙', pt: 'lua', translations: { en: 'moon', es: 'luna', it: 'luna', de: 'der Mond' } },
  { id: 'water', category: 'natureza', emoji: '💧', pt: 'água', translations: { en: 'water', es: 'agua', it: 'acqua', de: 'das Wasser' } },
  { id: 'tree', category: 'natureza', emoji: '🌳', pt: 'árvore', translations: { en: 'tree', es: 'árbol', it: 'albero', de: 'der Baum' } },
  { id: 'flower', category: 'natureza', emoji: '🌸', pt: 'flor', translations: { en: 'flower', es: 'flor', it: 'fiore', de: 'die Blume' } },
  { id: 'star', category: 'natureza', emoji: '⭐', pt: 'estrela', translations: { en: 'star', es: 'estrella', it: 'stella', de: 'der Stern' } },
  { id: 'dog', category: 'animais', emoji: '🐶', pt: 'cachorro', translations: { en: 'dog', es: 'perro', it: 'cane', de: 'der Hund' } },
  { id: 'cat', category: 'animais', emoji: '🐱', pt: 'gato', translations: { en: 'cat', es: 'gato', it: 'gatto', de: 'die Katze' } },
  { id: 'duck', category: 'animais', emoji: '🦆', pt: 'pato', translations: { en: 'duck', es: 'pato', it: 'papera', de: 'die Ente' } },
  { id: 'fish', category: 'animais', emoji: '🐟', pt: 'peixe', translations: { en: 'fish', es: 'pez', it: 'pesce', de: 'der Fisch' } },
  { id: 'bird', category: 'animais', emoji: '🐦', pt: 'pássaro', translations: { en: 'bird', es: 'pájaro', it: 'uccello', de: 'der Vogel' } },
  { id: 'bear', category: 'animais', emoji: '🐻', pt: 'urso', translations: { en: 'bear', es: 'oso', it: 'orso', de: 'der Bär' } },
  { id: 'rabbit', category: 'animais', emoji: '🐰', pt: 'coelho', translations: { en: 'rabbit', es: 'conejo', it: 'coniglio', de: 'der Hase' } },
  { id: 'cow', category: 'animais', emoji: '🐮', pt: 'vaca', translations: { en: 'cow', es: 'vaca', it: 'mucca', de: 'die Kuh' } },
  { id: 'butterfly', category: 'animais', emoji: '🦋', pt: 'borboleta', translations: { en: 'butterfly', es: 'mariposa', it: 'farfalla', de: 'der Schmetterling' } },
  { id: 'apple', category: 'comida', emoji: '🍎', pt: 'maçã', translations: { en: 'apple', es: 'manzana', it: 'mela', de: 'der Apfel' } },
  { id: 'banana', category: 'comida', emoji: '🍌', pt: 'banana', translations: { en: 'banana', es: 'plátano', it: 'banana', de: 'die Banane' } },
  { id: 'bread', category: 'comida', emoji: '🍞', pt: 'pão', translations: { en: 'bread', es: 'pan', it: 'pane', de: 'das Brot' } },
  { id: 'milk', category: 'comida', emoji: '🥛', pt: 'leite', translations: { en: 'milk', es: 'leche', it: 'latte', de: 'die Milch' } },
  { id: 'egg', category: 'comida', emoji: '🥚', pt: 'ovo', translations: { en: 'egg', es: 'huevo', it: 'uovo', de: 'das Ei' } },
  { id: 'cake', category: 'comida', emoji: '🍰', pt: 'bolo', translations: { en: 'cake', es: 'pastel', it: 'torta', de: 'der Kuchen' } },
  { id: 'house', category: 'casa', emoji: '🏠', pt: 'casa', translations: { en: 'house', es: 'casa', it: 'casa', de: 'das Haus' } },
  { id: 'door', category: 'casa', emoji: '🚪', pt: 'porta', translations: { en: 'door', es: 'puerta', it: 'porta', de: 'die Tür' } },
  { id: 'bed', category: 'casa', emoji: '🛏️', pt: 'cama', translations: { en: 'bed', es: 'cama', it: 'letto', de: 'das Bett' } },
  { id: 'ball', category: 'brinquedos', emoji: '⚽', pt: 'bola', translations: { en: 'ball', es: 'pelota', it: 'palla', de: 'der Ball' } },
  { id: 'book', category: 'brinquedos', emoji: '📚', pt: 'livro', translations: { en: 'book', es: 'libro', it: 'libro', de: 'das Buch' } },
  { id: 'car', category: 'brinquedos', emoji: '🚗', pt: 'carro', translations: { en: 'car', es: 'coche', it: 'macchina', de: 'das Auto' } },
  { id: 'boat', category: 'brinquedos', emoji: '⛵', pt: 'barco', translations: { en: 'boat', es: 'barco', it: 'barca', de: 'das Boot' } },
  { id: 'balloon', category: 'brinquedos', emoji: '🎈', pt: 'balão', translations: { en: 'balloon', es: 'globo', it: 'palloncino', de: 'der Luftballon' } },
  { id: 'head', category: 'corpo', emoji: '🗣️', pt: 'cabeça', translations: { en: 'head', es: 'cabeza', it: 'testa', de: 'der Kopf' } },
  { id: 'hand', category: 'corpo', emoji: '✋', pt: 'mão', translations: { en: 'hand', es: 'mano', it: 'mano', de: 'die Hand' } },
  { id: 'eye', category: 'corpo', emoji: '👀', pt: 'olho', translations: { en: 'eye', es: 'ojo', it: 'occhio', de: 'das Auge' } },
  { id: 'foot', category: 'corpo', emoji: '🦶', pt: 'pé', translations: { en: 'foot', es: 'pie', it: 'piede', de: 'der Fuß' } },
  { id: 'mother', category: 'familia', emoji: '👩', pt: 'mãe', translations: { en: 'mother', es: 'madre', it: 'madre', de: 'die Mutter' } },
  { id: 'father', category: 'familia', emoji: '👨', pt: 'pai', translations: { en: 'father', es: 'padre', it: 'padre', de: 'der Vater' } },
  { id: 'friend', category: 'familia', emoji: '🧑‍🤝‍🧑', pt: 'amigo', translations: { en: 'friend', es: 'amigo', it: 'amico', de: 'der Freund' } },
  { id: 'one', category: 'numeros', emoji: '1️⃣', pt: 'um', translations: { en: 'one', es: 'uno', it: 'uno', de: 'eins' } },
  { id: 'two', category: 'numeros', emoji: '2️⃣', pt: 'dois', translations: { en: 'two', es: 'dos', it: 'due', de: 'zwei' } },
  { id: 'three', category: 'numeros', emoji: '3️⃣', pt: 'três', translations: { en: 'three', es: 'tres', it: 'tre', de: 'drei' } },
  { id: 'red', category: 'cores', emoji: '🔴', pt: 'vermelho', translations: { en: 'red', es: 'rojo', it: 'rosso', de: 'rot' } },
  { id: 'blue', category: 'cores', emoji: '🔵', pt: 'azul', translations: { en: 'blue', es: 'azul', it: 'blu', de: 'blau' } },
  { id: 'yellow', category: 'cores', emoji: '🟡', pt: 'amarelo', translations: { en: 'yellow', es: 'amarillo', it: 'giallo', de: 'gelb' } },
];

// 1000+ words per language, organized by theme in src/data/wordbank/. Every
// German noun carries its article (der/die/das); colors, numbers, and verb
// infinitives don't take one. Words beyond the 41 core ones render with
// their emoji (WordIllustration only has custom art for the core set).
export const WORD_BANK: WordEntry[] = [
  ...CORE_WORDS,
  ...ANIMALS_1,
  ...ANIMALS_2,
  ...BODY_FAMILY,
  ...HOUSE,
  ...KITCHEN_FRUITS,
  ...FOOD_VEGETABLES,
  ...CLOTHES,
  ...NATURE_WEATHER_PLANTS,
  ...TRANSPORT_PROFESSIONS,
  ...SCHOOL_TOYS_SPORTS,
  ...MUSIC_EMOTIONS_TIME,
  ...PLACES_TECH_TOOLS,
  ...HYGIENE_FARM_SPACE,
  ...VERBS_1,
  ...VERBS_2,
  ...ADJECTIVES,
  ...HOLIDAYS_MATERIALS,
  ...FOOD_EXTRA,
  ...POSITIONS_ORDINALS_EXTRA,
  ...HOUSEHOLD_MISC,
  ...FINAL_BATCH,
  ...TOP_UP,
];

export function getWord(id: string): WordEntry | undefined {
  return WORD_BANK.find((w) => w.id === id);
}

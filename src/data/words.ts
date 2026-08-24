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

// Starter word bank: concrete, picturable nouns a 5-year-old can point at.
// Grow this list freely — the session builder pulls from whatever is here.
export const WORD_BANK: WordEntry[] = [
  { id: 'sun', category: 'natureza', emoji: '☀️', pt: 'sol', translations: { en: 'sun', es: 'sol', it: 'sole', de: 'Sonne' } },
  { id: 'moon', category: 'natureza', emoji: '🌙', pt: 'lua', translations: { en: 'moon', es: 'luna', it: 'luna', de: 'Mond' } },
  { id: 'water', category: 'natureza', emoji: '💧', pt: 'água', translations: { en: 'water', es: 'agua', it: 'acqua', de: 'Wasser' } },
  { id: 'tree', category: 'natureza', emoji: '🌳', pt: 'árvore', translations: { en: 'tree', es: 'árbol', it: 'albero', de: 'Baum' } },
  { id: 'flower', category: 'natureza', emoji: '🌸', pt: 'flor', translations: { en: 'flower', es: 'flor', it: 'fiore', de: 'Blume' } },
  { id: 'star', category: 'natureza', emoji: '⭐', pt: 'estrela', translations: { en: 'star', es: 'estrella', it: 'stella', de: 'Stern' } },
  { id: 'dog', category: 'animais', emoji: '🐶', pt: 'cachorro', translations: { en: 'dog', es: 'perro', it: 'cane', de: 'Hund' } },
  { id: 'cat', category: 'animais', emoji: '🐱', pt: 'gato', translations: { en: 'cat', es: 'gato', it: 'gatto', de: 'Katze' } },
  { id: 'duck', category: 'animais', emoji: '🦆', pt: 'pato', translations: { en: 'duck', es: 'pato', it: 'papera', de: 'Ente' } },
  { id: 'fish', category: 'animais', emoji: '🐟', pt: 'peixe', translations: { en: 'fish', es: 'pez', it: 'pesce', de: 'Fisch' } },
  { id: 'bird', category: 'animais', emoji: '🐦', pt: 'pássaro', translations: { en: 'bird', es: 'pájaro', it: 'uccello', de: 'Vogel' } },
  { id: 'bear', category: 'animais', emoji: '🐻', pt: 'urso', translations: { en: 'bear', es: 'oso', it: 'orso', de: 'Bär' } },
  { id: 'rabbit', category: 'animais', emoji: '🐰', pt: 'coelho', translations: { en: 'rabbit', es: 'conejo', it: 'coniglio', de: 'Hase' } },
  { id: 'cow', category: 'animais', emoji: '🐮', pt: 'vaca', translations: { en: 'cow', es: 'vaca', it: 'mucca', de: 'Kuh' } },
  { id: 'butterfly', category: 'animais', emoji: '🦋', pt: 'borboleta', translations: { en: 'butterfly', es: 'mariposa', it: 'farfalla', de: 'Schmetterling' } },
  { id: 'apple', category: 'comida', emoji: '🍎', pt: 'maçã', translations: { en: 'apple', es: 'manzana', it: 'mela', de: 'Apfel' } },
  { id: 'banana', category: 'comida', emoji: '🍌', pt: 'banana', translations: { en: 'banana', es: 'plátano', it: 'banana', de: 'Banane' } },
  { id: 'bread', category: 'comida', emoji: '🍞', pt: 'pão', translations: { en: 'bread', es: 'pan', it: 'pane', de: 'Brot' } },
  { id: 'milk', category: 'comida', emoji: '🥛', pt: 'leite', translations: { en: 'milk', es: 'leche', it: 'latte', de: 'Milch' } },
  { id: 'egg', category: 'comida', emoji: '🥚', pt: 'ovo', translations: { en: 'egg', es: 'huevo', it: 'uovo', de: 'Ei' } },
  { id: 'cake', category: 'comida', emoji: '🍰', pt: 'bolo', translations: { en: 'cake', es: 'pastel', it: 'torta', de: 'Kuchen' } },
  { id: 'house', category: 'casa', emoji: '🏠', pt: 'casa', translations: { en: 'house', es: 'casa', it: 'casa', de: 'Haus' } },
  { id: 'door', category: 'casa', emoji: '🚪', pt: 'porta', translations: { en: 'door', es: 'puerta', it: 'porta', de: 'Tür' } },
  { id: 'bed', category: 'casa', emoji: '🛏️', pt: 'cama', translations: { en: 'bed', es: 'cama', it: 'letto', de: 'Bett' } },
  { id: 'ball', category: 'brinquedos', emoji: '⚽', pt: 'bola', translations: { en: 'ball', es: 'pelota', it: 'palla', de: 'Ball' } },
  { id: 'book', category: 'brinquedos', emoji: '📚', pt: 'livro', translations: { en: 'book', es: 'libro', it: 'libro', de: 'Buch' } },
  { id: 'car', category: 'brinquedos', emoji: '🚗', pt: 'carro', translations: { en: 'car', es: 'coche', it: 'macchina', de: 'Auto' } },
  { id: 'boat', category: 'brinquedos', emoji: '⛵', pt: 'barco', translations: { en: 'boat', es: 'barco', it: 'barca', de: 'Boot' } },
  { id: 'balloon', category: 'brinquedos', emoji: '🎈', pt: 'balão', translations: { en: 'balloon', es: 'globo', it: 'palloncino', de: 'Luftballon' } },
  { id: 'head', category: 'corpo', emoji: '🗣️', pt: 'cabeça', translations: { en: 'head', es: 'cabeza', it: 'testa', de: 'Kopf' } },
  { id: 'hand', category: 'corpo', emoji: '✋', pt: 'mão', translations: { en: 'hand', es: 'mano', it: 'mano', de: 'Hand' } },
  { id: 'eye', category: 'corpo', emoji: '👀', pt: 'olho', translations: { en: 'eye', es: 'ojo', it: 'occhio', de: 'Auge' } },
  { id: 'foot', category: 'corpo', emoji: '🦶', pt: 'pé', translations: { en: 'foot', es: 'pie', it: 'piede', de: 'Fuß' } },
  { id: 'mother', category: 'familia', emoji: '👩', pt: 'mãe', translations: { en: 'mother', es: 'madre', it: 'madre', de: 'Mutter' } },
  { id: 'father', category: 'familia', emoji: '👨', pt: 'pai', translations: { en: 'father', es: 'padre', it: 'padre', de: 'Vater' } },
  { id: 'friend', category: 'familia', emoji: '🧑‍🤝‍🧑', pt: 'amigo', translations: { en: 'friend', es: 'amigo', it: 'amico', de: 'Freund' } },
  { id: 'one', category: 'numeros', emoji: '1️⃣', pt: 'um', translations: { en: 'one', es: 'uno', it: 'uno', de: 'eins' } },
  { id: 'two', category: 'numeros', emoji: '2️⃣', pt: 'dois', translations: { en: 'two', es: 'dos', it: 'due', de: 'zwei' } },
  { id: 'three', category: 'numeros', emoji: '3️⃣', pt: 'três', translations: { en: 'three', es: 'tres', it: 'tre', de: 'drei' } },
  { id: 'red', category: 'cores', emoji: '🔴', pt: 'vermelho', translations: { en: 'red', es: 'rojo', it: 'rosso', de: 'rot' } },
  { id: 'blue', category: 'cores', emoji: '🔵', pt: 'azul', translations: { en: 'blue', es: 'azul', it: 'blu', de: 'blau' } },
  { id: 'yellow', category: 'cores', emoji: '🟡', pt: 'amarelo', translations: { en: 'yellow', es: 'amarillo', it: 'giallo', de: 'gelb' } },
];

export function getWord(id: string): WordEntry | undefined {
  return WORD_BANK.find((w) => w.id === id);
}

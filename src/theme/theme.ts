// "Pequeno Pato" design language, per the project spec: warm paper beige,
// moss green as the primary/success color, light earth brown as the
// secondary/neutral — low-stimulus, rounded, very soft shadows, no
// confetti-style flourishes. Rewards stay subtle (a small bounce + a soft
// chime), not a burst of visual noise.

export const colors = {
  parchment: '#F4F1EA',
  parchmentDeep: '#EBE6D8',
  forest: '#8A9A5B',
  forestDeep: '#6F7D4C',
  honey: '#E0B589',
  honeyDeep: '#C99A68',
  rust: '#C99C87',
  rustDeep: '#B08268',
  plum: '#A896A0',
  plumDeep: '#8C7A85',
  pond: '#AEC3CE',
  pondDeep: '#8FAAB8',
  ink: '#4A4030',
  inkSoft: '#7A6F5C',
  card: '#FFFDF8',
  cardAlt: '#EFE8D8',
  success: '#8A9A5B',
  successDeep: '#6F7D4C',
  warn: '#C99C87',
  shadow: 'rgba(74, 64, 48, 0.12)',
} as const;

export const languageColors: Record<string, string> = {
  en: '#8A9A5B',
  fr: '#8FAAC4',
  it: '#C99C87',
  de: '#D9C27E',
};

export const languageLabels: Record<string, { name: string; flag: string }> = {
  en: { name: 'Inglês', flag: '🇺🇸' },
  fr: { name: 'Francês', flag: '🇫🇷' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  de: { name: 'Alemão', flag: '🇩🇪' },
};

export const radii = {
  sm: 12,
  md: 20,
  lg: 28,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  display: { fontSize: 40, fontWeight: '800' as const },
  title: { fontSize: 28, fontWeight: '800' as const },
  word: { fontSize: 34, fontWeight: '800' as const },
  body: { fontSize: 18, fontWeight: '600' as const },
  caption: { fontSize: 14, fontWeight: '600' as const },
};

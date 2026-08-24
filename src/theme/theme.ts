// "Pequeno Pato" design language — a warm, painterly storybook look inspired
// by the muted forest/pond palette of O Pequeno Urso (TV Cultura): parchment
// backgrounds, soft sage/honey/terracotta tones, hand-illustrated feel rather
// than glossy flat-vector cartoon colors.

export const colors = {
  parchment: '#F4ECDA',
  parchmentDeep: '#EADFC3',
  forest: '#7C9A6E',
  forestDeep: '#5F7F52',
  pond: '#8FB6C7',
  pondDeep: '#6B96A8',
  honey: '#E3A94B',
  honeyDeep: '#C98A2E',
  rust: '#C4704A',
  rustDeep: '#A65B39',
  plum: '#8C7196',
  plumDeep: '#6F5876',
  ink: '#4A3B2D',
  inkSoft: '#7C6A55',
  card: '#FFFBF1',
  cardAlt: '#F6EAD2',
  success: '#6FA35C',
  successDeep: '#4F7F3F',
  warn: '#C4704A',
  shadow: 'rgba(74, 59, 45, 0.20)',
} as const;

export const languageColors: Record<string, string> = {
  en: '#6C93A6',
  es: '#C4704A',
  it: '#7C9A6E',
  de: '#D9A055',
};

export const languageLabels: Record<string, { name: string; flag: string }> = {
  en: { name: 'Inglês', flag: '🇺🇸' },
  es: { name: 'Espanhol', flag: '🇪🇸' },
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

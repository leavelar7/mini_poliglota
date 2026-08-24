// "Pequeno Pato" design language — soft, rounded, high-contrast for pre-readers.
// Inspired by the pastel storybook look of O Pequeno Urso (TV Cultura).

export const colors = {
  sky: '#BFE6F5',
  skyDeep: '#8FD3EC',
  pondGreen: '#CDEFC4',
  sun: '#FFD469',
  sunDeep: '#FFB84D',
  duckOrange: '#FF9642',
  berry: '#FF7A7A',
  plum: '#7A5FB8',
  ink: '#3A3A4A',
  inkSoft: '#6B6B80',
  card: '#FFFFFF',
  cardAlt: '#FFF6E5',
  success: '#5FCB8E',
  successDeep: '#3FAF71',
  warn: '#FF8A65',
  shadow: 'rgba(58, 58, 74, 0.15)',
} as const;

export const languageColors: Record<string, string> = {
  en: '#5B9BD5',
  es: '#FF8A65',
  it: '#6BC26B',
  de: '#F2C94C',
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

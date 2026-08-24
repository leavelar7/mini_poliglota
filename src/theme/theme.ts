// "Pequeno Pato" design language — a calm, low-stimulation storybook look.
// Every color here is deliberately desaturated (soft pastel, close values,
// gentle contrast) so the screen stays quiet and the child's attention goes
// to the word and its pronunciation, not to the interface. Loosely inspired
// by the muted forest/pond mood of O Pequeno Urso (TV Cultura), toned down
// further on purpose — this is not meant to be visually exciting.

export const colors = {
  parchment: '#F7F3EA',
  parchmentDeep: '#EFE8DA',
  forest: '#ACC0A4',
  forestDeep: '#8FA687',
  pond: '#BBD3DA',
  pondDeep: '#9FBCC4',
  honey: '#E3CDA0',
  honeyDeep: '#CDB07E',
  rust: '#D3AC9B',
  rustDeep: '#BE9484',
  plum: '#B4A2B9',
  plumDeep: '#9986A0',
  ink: '#5B4C3E',
  inkSoft: '#8C7D6C',
  card: '#FEFCF6',
  cardAlt: '#F3ECDE',
  success: '#A9BE9E',
  successDeep: '#8AA47D',
  warn: '#D3AC9B',
  shadow: 'rgba(91, 76, 62, 0.14)',
} as const;

export const languageColors: Record<string, string> = {
  en: '#A6BDC6',
  es: '#D3AC9B',
  it: '#ACC0A4',
  de: '#DCC79E',
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

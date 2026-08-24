import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WordEntry, LanguageCode } from '../data/words';
import { colors, languageColors, languageLabels, radii, spacing, typography } from '../theme/theme';
import { WordIllustration } from '../illustrations/WordIllustration';

interface Props {
  word: WordEntry;
  lang: LanguageCode;
}

export function WordCard({ word, lang }: Props) {
  const langColor = languageColors[lang];
  return (
    <View style={[styles.card, { borderColor: langColor }]}>
      <View style={[styles.flagPill, { backgroundColor: langColor }]}>
        <Text style={styles.flagText}>
          {languageLabels[lang].flag} {languageLabels[lang].name}
        </Text>
      </View>
      <View style={styles.illustration}>
        <WordIllustration wordId={word.id} emojiFallback={word.emoji} size={110} />
      </View>
      <Text style={styles.word}>{word.translations[lang]}</Text>
      <Text style={styles.pt}>({word.pt})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 4,
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    width: '100%',
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  flagPill: {
    position: 'absolute',
    top: -18,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  flagText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  illustration: { marginTop: spacing.md, marginBottom: spacing.md },
  word: { ...typography.word, color: colors.ink, textAlign: 'center' },
  pt: { ...typography.caption, color: colors.inkSoft, marginTop: spacing.xs },
});

import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors, languageColors, languageLabels, radii, spacing, typography } from '../theme/theme';
import { getWord, LANGUAGES, LanguageCode } from '../data/words';
import { loadProgress, loadStreak, StreakInfo } from '../lib/storage';
import { ProgressMap, statusOf } from '../lib/srs';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

interface WeakWord {
  wordId: string;
  lang: LanguageCode;
  wrongCount: number;
  correctCount: number;
  accuracy: number;
}

export function DashboardScreen({ navigation }: Props) {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [streak, setStreak] = useState<StreakInfo | null>(null);

  useEffect(() => {
    loadProgress().then(setProgress);
    loadStreak().then(setStreak);
  }, []);

  const perLanguageStats = useMemo(() => {
    return LANGUAGES.map((lang) => {
      let known = 0;
      let learning = 0;
      let introduced = 0;
      Object.entries(progress).forEach(([key, p]) => {
        if (!key.endsWith(`:${lang}`)) return;
        introduced += 1;
        const status = statusOf(p);
        if (status === 'known') known += 1;
        else if (status === 'learning' || status === 'forgotten') learning += 1;
      });
      return { lang, known, learning, introduced };
    });
  }, [progress]);

  const weakWords = useMemo<WeakWord[]>(() => {
    const rows: WeakWord[] = Object.entries(progress)
      .map(([key, p]) => {
        const [wordId, lang] = key.split(':') as [string, LanguageCode];
        const total = p.correctCount + p.wrongCount;
        const accuracy = total > 0 ? p.correctCount / total : 1;
        return { wordId, lang, wrongCount: p.wrongCount, correctCount: p.correctCount, accuracy };
      })
      .filter((r) => r.wrongCount > 0)
      .sort((a, b) => a.accuracy - b.accuracy || b.wrongCount - a.wrongCount);
    return rows.slice(0, 10);
  }, [progress]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Progresso</Text>
      </View>

      <View style={styles.streakCard}>
        <Text style={styles.streakText}>🔥 {streak?.currentStreak ?? 0} dia(s) seguidos</Text>
        <Text style={styles.streakSub}>{streak?.totalSessions ?? 0} sessões completas</Text>
      </View>

      <View style={styles.langGrid}>
        {perLanguageStats.map((s) => (
          <View key={s.lang} style={[styles.langCard, { borderColor: languageColors[s.lang] }]}>
            <Text style={styles.langFlag}>{languageLabels[s.lang].flag}</Text>
            <Text style={styles.langName}>{languageLabels[s.lang].name}</Text>
            <Text style={styles.langStat}>✅ {s.known} dominadas</Text>
            <Text style={styles.langStat}>📖 {s.learning} aprendendo</Text>
            <Text style={styles.langStat}>🆕 {s.introduced - s.known - s.learning} novas vistas</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Palavras para treinar</Text>
      <FlatList
        data={weakWords}
        keyExtractor={(item) => `${item.wordId}:${item.lang}`}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        ListEmptyComponent={<Text style={styles.emptyText}>Ainda sem dados suficientes — comece uma sessão!</Text>}
        renderItem={({ item }) => {
          const word = getWord(item.wordId);
          if (!word) return null;
          return (
            <View style={styles.weakRow}>
              <Text style={styles.weakEmoji}>{word.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.weakWord}>
                  {word.translations[item.lang]} <Text style={styles.weakLangFlag}>{languageLabels[item.lang].flag}</Text>
                </Text>
                <Text style={styles.weakPt}>{word.pt}</Text>
              </View>
              <Text style={styles.weakAccuracy}>{Math.round(item.accuracy * 100)}%</Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.pondGreen, paddingHorizontal: spacing.lg },
  headerRow: { paddingTop: spacing.lg, paddingBottom: spacing.sm },
  title: { ...typography.title, color: colors.ink },
  streakCard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  streakText: { ...typography.body, color: colors.ink },
  streakSub: { ...typography.caption, color: colors.inkSoft, marginTop: 2 },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  langCard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 3,
    padding: spacing.sm,
    width: '47%',
  },
  langFlag: { fontSize: 24 },
  langName: { ...typography.caption, color: colors.ink, marginBottom: spacing.xs },
  langStat: { fontSize: 13, color: colors.inkSoft },
  sectionTitle: { ...typography.body, color: colors.ink, marginBottom: spacing.sm },
  weakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  weakEmoji: { fontSize: 30, marginRight: spacing.sm },
  weakWord: { ...typography.body, color: colors.ink },
  weakLangFlag: { fontSize: 14 },
  weakPt: { ...typography.caption, color: colors.inkSoft },
  weakAccuracy: { ...typography.body, color: colors.warn },
  emptyText: { ...typography.caption, color: colors.inkSoft, textAlign: 'center', marginTop: spacing.lg },
});

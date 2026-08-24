import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors, languageColors, languageLabels, radii, spacing, typography } from '../theme/theme';
import { getWord } from '../data/words';
import { loadProgress, loadStreak, StreakInfo } from '../lib/storage';
import { computeLanguageStats, computeWeakWords, LanguageStat, ProgressEntry, WeakWord } from '../lib/dashboardStats';
import { BigButton } from '../components/BigButton';
import { NatureBackdrop } from '../components/NatureBackdrop';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

// Reads straight from this device's local progress — no parent account or
// login required, just the gear icon on the Home screen.
export function DashboardScreen({ navigation }: Props) {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    (async () => {
      const [progress, streak] = await Promise.all([loadProgress(), loadStreak()]);
      const localEntries: ProgressEntry[] = Object.entries(progress).map(([key, p]) => {
        const [wordId, lang] = key.split(':');
        return {
          wordId,
          lang: lang as ProgressEntry['lang'],
          interval: p.interval,
          lastSeenAt: p.lastSeenAt,
          correctCount: p.correctCount,
          wrongCount: p.wrongCount,
        };
      });
      setEntries(localEntries);
      setTotalSessions(streak.totalSessions);
    })();
  }, []);

  const langStats = computeLanguageStats(entries);
  const weakWords = computeWeakWords(entries);

  return (
    <SafeAreaView style={styles.container}>
      <NatureBackdrop variant="pond" />
      <View style={styles.headerRow}>
        <Text style={styles.title}>Progresso</Text>
      </View>

      <View style={styles.streakCard}>
        <Text style={styles.streakSub}>{totalSessions} sessões completas</Text>
      </View>

      <LanguageGrid stats={langStats} />

      <Text style={styles.sectionTitle}>Palavras para treinar</Text>
      <WeakWordsList weakWords={weakWords} />

      <BigButton label="⬅️  Voltar" onPress={() => navigation.navigate('Home')} color={colors.plum} style={{ marginTop: spacing.md, width: '100%' }} />
    </SafeAreaView>
  );
}

function LanguageGrid({ stats }: { stats: LanguageStat[] }) {
  return (
    <View style={styles.langGrid}>
      {stats.map((s) => (
        <View key={s.lang} style={[styles.langCard, { borderColor: languageColors[s.lang] }]}>
          <Text style={styles.langFlag}>{languageLabels[s.lang].flag}</Text>
          <Text style={styles.langName}>{languageLabels[s.lang].name}</Text>
          <Text style={styles.langStat}>✅ {s.known} dominadas</Text>
          <Text style={styles.langStat}>📖 {s.learning} aprendendo</Text>
          <Text style={styles.langStat}>🆕 {Math.max(0, s.introduced - s.known - s.learning)} novas vistas</Text>
        </View>
      ))}
    </View>
  );
}

function WeakWordsList({ weakWords }: { weakWords: WeakWord[] }) {
  return (
    <FlatList
      data={weakWords}
      keyExtractor={(item) => `${item.wordId}:${item.lang}`}
      contentContainerStyle={{ paddingBottom: spacing.lg }}
      scrollEnabled={false}
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.parchment, paddingHorizontal: spacing.lg },
  headerRow: { paddingTop: spacing.lg, paddingBottom: spacing.sm },
  title: { ...typography.title, color: colors.ink },
  streakCard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  streakSub: { ...typography.body, color: colors.ink },
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

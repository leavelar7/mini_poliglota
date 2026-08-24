import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors, languageColors, languageLabels, radii, spacing, typography } from '../theme/theme';
import { getWord } from '../data/words';
import { loadProgress, loadStreak, StreakInfo } from '../lib/storage';
import { supabase } from '../lib/supabaseClient';
import { fetchDashboardData } from '../lib/cloudSync';
import { computeLanguageStats, computeWeakWords, LanguageStat, ProgressEntry, WeakWord } from '../lib/dashboardStats';
import { AuthForm } from '../components/AuthForm';
import { BigButton } from '../components/BigButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export function DashboardScreen({ navigation }: Props) {
  const [session, setSession] = useState<Session | null | 'loading'>('loading');
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [source, setSource] = useState<'cloud' | 'local' | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadLocal = useCallback(async () => {
    const [progress, streak] = await Promise.all([loadProgress(), loadStreak()]);
    const localEntries: ProgressEntry[] = Object.entries(progress).map(([key, p]) => {
      const [wordId, lang] = key.split(':');
      return {
        wordId,
        lang: lang as ProgressEntry['lang'],
        box: p.box,
        correctCount: p.correctCount,
        wrongCount: p.wrongCount,
        forgottenCount: p.forgottenCount,
      };
    });
    setEntries(localEntries);
    setTotalSessions(streak.totalSessions);
    setSource('local');
  }, []);

  const loadCloud = useCallback(async () => {
    setLoadingData(true);
    try {
      const remote = await fetchDashboardData();
      if (!remote) {
        await loadLocal();
        return;
      }
      setEntries(
        remote.progress.map((r) => ({
          wordId: r.word_id,
          lang: r.lang as ProgressEntry['lang'],
          box: r.box,
          correctCount: r.correct_count,
          wrongCount: r.wrong_count,
          forgottenCount: r.forgotten_count,
        }))
      );
      setTotalSessions(remote.totalSessions);
      setSource('cloud');
    } catch {
      // Cloud tables may not exist yet (migration not run) or the device is
      // offline — fall back to what's on this phone rather than a dead screen.
      await loadLocal();
    } finally {
      setLoadingData(false);
    }
  }, [loadLocal]);

  useEffect(() => {
    if (session && session !== 'loading') loadCloud();
    else if (session === null) loadLocal();
  }, [session, loadCloud, loadLocal]);

  if (session === 'loading') {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator color={colors.plum} />
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <AuthForm onSignedIn={() => {}} />
        <Text style={styles.localHint} onPress={loadLocal}>
          Ver progresso deste aparelho sem entrar
        </Text>
        {source === 'local' && <LocalOnlyView entries={entries} totalSessions={totalSessions} />}
        <BigButton label="⬅️  Voltar" onPress={() => navigation.navigate('Home')} color={colors.plum} style={{ marginTop: spacing.lg, width: '100%' }} />
      </SafeAreaView>
    );
  }

  const langStats = computeLanguageStats(entries);
  const weakWords = computeWeakWords(entries);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Progresso</Text>
        <Text style={styles.signOut} onPress={() => supabase.auth.signOut()}>
          Sair
        </Text>
      </View>

      {source === 'local' && <Text style={styles.warnBanner}>⚠️ Sem conexão com a nuvem — mostrando dados deste aparelho.</Text>}
      {loadingData && <ActivityIndicator color={colors.plum} style={{ marginBottom: spacing.sm }} />}

      <SummaryCard totalSessions={totalSessions} />
      <LanguageGrid stats={langStats} />

      <Text style={styles.sectionTitle}>Palavras para treinar</Text>
      <WeakWordsList weakWords={weakWords} />
    </SafeAreaView>
  );
}

function LocalOnlyView({ entries, totalSessions }: { entries: ProgressEntry[]; totalSessions: number }) {
  const langStats = computeLanguageStats(entries);
  const weakWords = computeWeakWords(entries);
  return (
    <View style={{ width: '100%', marginTop: spacing.lg }}>
      <SummaryCard totalSessions={totalSessions} />
      <LanguageGrid stats={langStats} />
      <Text style={styles.sectionTitle}>Palavras para treinar</Text>
      <WeakWordsList weakWords={weakWords} />
    </View>
  );
}

function SummaryCard({ totalSessions }: { totalSessions: number }) {
  return (
    <View style={styles.streakCard}>
      <Text style={styles.streakSub}>{totalSessions} sessões completas</Text>
    </View>
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
      contentContainerStyle={{ paddingBottom: spacing.xl }}
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
  container: { flex: 1, backgroundColor: colors.pondGreen, paddingHorizontal: spacing.lg },
  centered: { alignItems: 'center', justifyContent: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.lg, paddingBottom: spacing.sm },
  title: { ...typography.title, color: colors.ink },
  signOut: { ...typography.caption, color: colors.plum },
  warnBanner: { ...typography.caption, color: colors.warn, marginBottom: spacing.sm },
  localHint: { ...typography.caption, color: colors.plum, textAlign: 'center', marginTop: spacing.md },
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

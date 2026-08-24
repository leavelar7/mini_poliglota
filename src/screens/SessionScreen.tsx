import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import * as Speech from 'expo-speech';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { WordCard } from '../components/WordCard';
import { BigButton } from '../components/BigButton';
import { DuckMascot } from '../components/DuckMascot';
import { SpeechAnswer } from '../components/SpeechAnswer';
import { NatureBackdrop } from '../components/NatureBackdrop';
import { colors, spacing, typography } from '../theme/theme';
import { LANGUAGES, TTS_LOCALE, getWord } from '../data/words';
import { buildDailySession, ProgressMap, recordAnswer, refreshForgotten, SessionCard } from '../lib/srs';
import { loadProgress, loadStreak, registerSessionCompletion, saveProgress, saveStreak } from '../lib/storage';
import { pushSessionResult } from '../lib/cloudSync';

type Props = NativeStackScreenProps<RootStackParamList, 'Session'>;

export function SessionScreen({ navigation }: Props) {
  const [progress, setProgress] = useState<ProgressMap | null>(null);
  const [cards, setCards] = useState<SessionCard[]>([]);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [correctInSession, setCorrectInSession] = useState(0);
  const [showManual, setShowManual] = useState(false);
  const isAdvancingRef = useRef(false);

  useEffect(() => {
    (async () => {
      const now = Date.now();
      const stored = refreshForgotten(await loadProgress(), now);
      const session = buildDailySession(stored, LANGUAGES, now, 30);
      setProgress(stored);
      setCards(session);
    })();
    return () => {
      Speech.stop();
    };
  }, []);

  const current = cards[index];
  const currentWord = current ? getWord(current.wordId) : undefined;

  const speak = useCallback(() => {
    if (!current || !currentWord) return;
    Speech.stop();
    Speech.speak(currentWord.translations[current.lang], { language: TTS_LOCALE[current.lang], rate: 0.85 });
  }, [current, currentWord]);

  useEffect(() => {
    isAdvancingRef.current = false;
    setShowManual(false);
    if (current) speak();
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  const finishSession = useCallback(async (finalProgress: ProgressMap, finalCorrect: number, totalCount: number) => {
    await saveProgress(finalProgress);
    const streak = await loadStreak();
    await saveStreak(registerSessionCompletion(streak, Date.now()));
    setDone(true);
    // Best-effort: the local save above is the source of truth, so a flaky
    // connection or a signed-out parent should never block finishing a session.
    pushSessionResult(finalProgress, finalCorrect, totalCount).catch(() => {});
  }, []);

  const answer = useCallback(
    (correct: boolean) => {
      // Guards against a double-tap firing this twice before the next
      // card renders — easy to trigger with an eager 5-year-old's thumb.
      if (!progress || !current || isAdvancingRef.current) return;
      isAdvancingRef.current = true;
      const next = recordAnswer(progress, current.wordId, current.lang, correct, Date.now());
      setProgress(next);
      const finalCorrect = correctInSession + (correct ? 1 : 0);
      if (correct) setCorrectInSession(finalCorrect);
      if (index + 1 >= cards.length) {
        finishSession(next, finalCorrect, cards.length);
      } else {
        setIndex(index + 1);
      }
    },
    [progress, current, index, cards.length, correctInSession, finishSession]
  );

  const langBlock = useMemo(() => {
    if (!current) return null;
    return LANGUAGES.indexOf(current.lang) + 1;
  }, [current]);

  if (done) {
    return (
      <SafeAreaView style={styles.container}>
        <NatureBackdrop />
        <View style={styles.content}>
          <DuckMascot size={160} mood="cheer" />
          <Text style={styles.title}>Muito bem! 🎉</Text>
          <Text style={styles.subtitle}>
            Você acertou {correctInSession} de {cards.length} palavras hoje.
          </Text>
          <BigButton label="⬅️  Voltar" onPress={() => navigation.navigate('Home')} style={{ marginTop: spacing.xl, width: '100%' }} />
        </View>
      </SafeAreaView>
    );
  }

  if (!current || !currentWord) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <NatureBackdrop />
      <View style={styles.header}>
        <ProgressBar current={index + 1} total={cards.length} />
        <Text style={styles.blockLabel}>Idioma {langBlock} de {LANGUAGES.length}</Text>
      </View>

      <View style={styles.content}>
        <WordCard word={currentWord} lang={current.lang} />

        <Pressable onPress={speak} style={styles.replayButton}>
          <Text style={styles.replayText}>🔊 Ouvir de novo</Text>
        </Pressable>

        <View style={styles.speechArea}>
          <SpeechAnswer key={`${current.wordId}:${current.lang}`} targetWord={currentWord.translations[current.lang]} locale={TTS_LOCALE[current.lang]} onResult={answer} />
        </View>

        {showManual ? (
          <View style={styles.answerRow}>
            <BigButton label="🔁 De novo" onPress={() => answer(false)} color={colors.warn} style={styles.answerButton} />
            <BigButton label="✅ Acertei" onPress={() => answer(true)} color={colors.success} style={styles.answerButton} />
          </View>
        ) : (
          <Pressable onPress={() => setShowManual(true)} style={styles.manualToggle}>
            <Text style={styles.manualToggleText}>ou responder manualmente</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${pct}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.parchment },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  progressTrack: { height: 10, borderRadius: 999, backgroundColor: '#ffffffaa', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.honey, borderRadius: 999 },
  blockLabel: { ...typography.caption, color: colors.inkSoft, marginTop: spacing.xs, textAlign: 'center' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  title: { ...typography.display, color: colors.ink, marginTop: spacing.md, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.inkSoft, marginTop: spacing.sm, textAlign: 'center' },
  replayButton: { marginTop: spacing.lg, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  replayText: { ...typography.body, color: colors.plum },
  speechArea: { width: '100%', marginTop: spacing.md },
  answerRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, width: '100%' },
  answerButton: { flex: 1 },
  manualToggle: { marginTop: spacing.md, padding: spacing.xs },
  manualToggleText: { ...typography.caption, color: colors.inkSoft, textDecorationLine: 'underline' },
});

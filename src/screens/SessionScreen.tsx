import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import * as Speech from 'expo-speech';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { WordCard } from '../components/WordCard';
import { BigButton } from '../components/BigButton';
import { DuckMascot } from '../components/DuckMascot';
import { SpeechAnswer } from '../components/SpeechAnswer';
import { NatureBackdrop } from '../components/NatureBackdrop';
import { colors, languageLabels, spacing, typography } from '../theme/theme';
import { LANGUAGES, LanguageCode, TTS_LOCALE, getWord } from '../data/words';
import { buildDailySession, ProgressMap, recordAnswer, SessionCard } from '../lib/srs';
import { loadProgress, loadStreak, registerSessionCompletion, saveProgress, saveStreak } from '../lib/storage';
import { addUsage, DailyUsage, isLockedOut, loadDailyUsage, MAX_MS_PER_DAY, saveDailyUsage } from '../lib/dailyLimit';
import { pushSessionResult } from '../lib/cloudSync';
import { pickVoice } from '../lib/ttsVoice';

type Props = NativeStackScreenProps<RootStackParamList, 'Session'>;

const LANG_INTRO_MS = 1500;

export function SessionScreen({ navigation }: Props) {
  const [progress, setProgress] = useState<ProgressMap | null>(null);
  const [cards, setCards] = useState<SessionCard[]>([]);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [correctInSession, setCorrectInSession] = useState(0);
  const [introLang, setIntroLang] = useState<LanguageCode | null>(null);
  const [nowTick, setNowTick] = useState(Date.now());
  const isAdvancingRef = useRef(false);
  const lastLangRef = useRef<LanguageCode | null>(null);
  const baseUsageRef = useRef<DailyUsage | null>(null);
  const sessionStartRef = useRef(Date.now());

  // Drives the progress bar, which tracks the real 10-minute time budget —
  // there are far more cards queued up than could ever fit in that time, so
  // a card-count-based bar would be meaningless.
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    (async () => {
      const now = Date.now();
      sessionStartRef.current = now;
      const usage = await loadDailyUsage(now);
      if (isLockedOut(usage)) {
        navigation.replace('Home');
        return;
      }
      baseUsageRef.current = usage;
      const stored = await loadProgress();
      const session = buildDailySession(stored, LANGUAGES, now);
      setProgress(stored);
      setCards(session);
    })();
    return () => {
      Speech.stop();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const current = cards[index];
  const currentWord = current ? getWord(current.wordId) : undefined;

  const speak = useCallback(async () => {
    if (!current || !currentWord) return;
    Speech.stop();
    const voice = await pickVoice(current.lang);
    Speech.speak(currentWord.translations[current.lang], { language: TTS_LOCALE[current.lang], voice, rate: 0.85 });
  }, [current, currentWord]);

  // Every time the language block changes (including the very first card),
  // pause on a full flag intro before playing audio — makes the accent
  // switch unmistakable instead of just a small pill on the card.
  useEffect(() => {
    isAdvancingRef.current = false;
    if (!current) return;
    if (current.lang !== lastLangRef.current) {
      lastLangRef.current = current.lang;
      setIntroLang(current.lang);
      const timer = setTimeout(() => {
        setIntroLang(null);
        speak();
      }, LANG_INTRO_MS);
      return () => clearTimeout(timer);
    }
    setIntroLang(null);
    speak();
    // `cards` loads asynchronously after mount while `index` stays 0, so
    // cards.length has to be a dependency too — otherwise this effect's only
    // run at index 0 happens before `current` exists (cards is still `[]`),
    // and the very first word gets no flag intro and no audio at all. The
    // real first-word intro then wrongly fires on the *second* word instead,
    // once `index` changes for the first time.
  }, [index, cards.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const finishSession = useCallback(
    async (finalProgress: ProgressMap, finalCorrect: number, wordsThisSession: number, msThisSession: number) => {
      await saveProgress(finalProgress);
      const streak = await loadStreak();
      await saveStreak(registerSessionCompletion(streak, Date.now()));
      const base = baseUsageRef.current ?? (await loadDailyUsage(Date.now()));
      await saveDailyUsage(addUsage(base, wordsThisSession, msThisSession));
      setDone(true);
      // Best-effort: the local save above is the source of truth, so a flaky
      // connection or a signed-out parent should never block finishing a session.
      pushSessionResult(finalProgress, finalCorrect, wordsThisSession).catch(() => {});
    },
    []
  );

  const answer = useCallback(
    (correct: boolean) => {
      // Guards against a double-fire before the next card renders.
      if (!progress || !current || isAdvancingRef.current) return;
      isAdvancingRef.current = true;
      const now = Date.now();
      const next = recordAnswer(progress, current.wordId, current.lang, correct, now);
      setProgress(next);
      const finalCorrect = correctInSession + (correct ? 1 : 0);
      if (correct) setCorrectInSession(finalCorrect);

      const wordsThisSession = index + 1;
      const msThisSession = now - sessionStartRef.current;
      const base = baseUsageRef.current;
      const capReached = base ? isLockedOut(addUsage(base, wordsThisSession, msThisSession)) : false;

      if (index + 1 >= cards.length || capReached) {
        finishSession(next, finalCorrect, wordsThisSession, msThisSession);
      } else {
        setIndex(index + 1);
      }
    },
    [progress, current, index, cards.length, correctInSession, finishSession]
  );

  if (done) {
    return (
      <SafeAreaView style={styles.container}>
        <NatureBackdrop />
        <View style={styles.content}>
          <DuckMascot size={160} mood="cheer" />
          <Text style={styles.title}>Muito bem! 🎉</Text>
          <Text style={styles.subtitle}>
            Você acertou {correctInSession} de {index + 1} palavras hoje.
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

  if (introLang) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.introFlag}>{languageLabels[introLang].flag}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const elapsedMsToday = (baseUsageRef.current?.msSpent ?? 0) + (nowTick - sessionStartRef.current);
  const timePct = Math.min(100, Math.round((elapsedMsToday / MAX_MS_PER_DAY) * 100));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ProgressBar pct={timePct} />
      </View>

      <View style={styles.content}>
        <WordCard word={currentWord} lang={current.lang} />

        <Pressable onPress={speak} style={styles.replayButton} hitSlop={12}>
          <Text style={styles.replayIcon}>🔊</Text>
        </Pressable>

        <View style={styles.speechArea}>
          <SpeechAnswer key={`${current.wordId}:${current.lang}`} targetWord={currentWord.translations[current.lang]} locale={TTS_LOCALE[current.lang]} onResult={answer} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function ProgressBar({ pct }: { pct: number }) {
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
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  title: { ...typography.display, color: colors.ink, marginTop: spacing.md, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.inkSoft, marginTop: spacing.sm, textAlign: 'center' },
  replayButton: { marginTop: spacing.lg, padding: spacing.sm },
  replayIcon: { fontSize: 32 },
  speechArea: { width: '100%', marginTop: spacing.md },
  introFlag: { fontSize: 120 },
});

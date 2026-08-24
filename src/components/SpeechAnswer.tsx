import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { scorePronunciation } from '../lib/matchWord';
import { colors, radii, spacing, typography } from '../theme/theme';

type Phase = 'idle' | 'listening' | 'result' | 'unavailable' | 'denied';

interface Props {
  targetWord: string;
  locale: string;
  onResult: (correct: boolean) => void;
}

// Lets the child speak the word into the mic, scores the transcript against
// the target with `scorePronunciation`, shows a brief icon-only verdict,
// then reports back via onResult. This is the only way to answer — if
// permission is denied, a retry button re-prompts (in case they granted it
// in Settings). Permission/unavailable text stays since those are rare,
// parent-facing edge cases outside the near-textless child loop.
export function SpeechAnswer({ targetWord, locale, onResult }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [verdict, setVerdict] = useState<boolean | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setPhase(ExpoSpeechRecognitionModule.isRecognitionAvailable() ? 'idle' : 'unavailable');
    return () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
      ExpoSpeechRecognitionModule.stop();
    };
  }, []);

  useEffect(() => {
    setVerdict(null);
    if (settleTimer.current) clearTimeout(settleTimer.current);
    setPhase((p) => (p === 'unavailable' ? p : 'idle'));
  }, [targetWord, locale]);

  useSpeechRecognitionEvent('result', (event) => {
    const transcript = event.results[0]?.transcript ?? '';
    if (event.isFinal && transcript) {
      const match = scorePronunciation(transcript, targetWord);
      setVerdict(match.correct);
      setPhase('result');
      settleTimer.current = setTimeout(() => onResult(match.correct), 1400);
    }
  });

  useSpeechRecognitionEvent('end', () => {
    setPhase((p) => (p === 'listening' ? 'idle' : p));
  });

  useSpeechRecognitionEvent('error', (event) => {
    setPhase(event.error === 'not-allowed' || event.error === 'service-not-allowed' ? 'denied' : 'idle');
  });

  const startListening = useCallback(async () => {
    const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!perm.granted) {
      setPhase('denied');
      return;
    }
    setVerdict(null);
    setPhase('listening');
    ExpoSpeechRecognitionModule.start({
      lang: locale,
      interimResults: true,
      continuous: false,
      iosTaskHint: 'confirmation',
      androidIntentOptions: { EXTRA_LANGUAGE_MODEL: 'web_search' },
    });
  }, [locale]);

  if (phase === 'unavailable') {
    return <Text style={styles.hint}>🎤 Reconhecimento de fala indisponível neste aparelho.</Text>;
  }

  if (phase === 'denied') {
    return (
      <View style={styles.resultBox}>
        <Text style={styles.hint}>🎤 Permissão de microfone negada.</Text>
        <Pressable onPress={startListening} style={styles.retryButton}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  if (phase === 'result' && verdict !== null) {
    return (
      <View style={styles.resultBox}>
        <Text style={[styles.verdictIcon, { color: verdict ? colors.successDeep : colors.warn }]}>{verdict ? '✅' : '🔁'}</Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={startListening}
      disabled={phase === 'listening'}
      style={({ pressed }) => [styles.micButton, phase === 'listening' && styles.micListening, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Text style={styles.micIcon}>{phase === 'listening' ? '🔴' : '🎤'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  micButton: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 3,
    borderColor: colors.honey,
    borderStyle: 'dashed',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
  micListening: { borderStyle: 'solid', backgroundColor: colors.cardAlt },
  micIcon: { fontSize: 40 },
  resultBox: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  verdictIcon: { fontSize: 48 },
  hint: { ...typography.caption, color: colors.inkSoft, textAlign: 'center', width: '100%' },
  retryButton: { marginTop: spacing.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  retryText: { ...typography.body, color: colors.plum },
});

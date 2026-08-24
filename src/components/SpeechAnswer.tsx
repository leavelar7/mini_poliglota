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
// the target with `scorePronunciation`, shows a brief verdict, then reports
// back via onResult. A manual fallback (SessionScreen's two big buttons)
// always stays available underneath for when recognition errors out.
export function SpeechAnswer({ targetWord, locale, onResult }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [heard, setHeard] = useState('');
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
    setHeard('');
    setVerdict(null);
    if (settleTimer.current) clearTimeout(settleTimer.current);
    setPhase((p) => (p === 'unavailable' ? p : 'idle'));
  }, [targetWord, locale]);

  useSpeechRecognitionEvent('result', (event) => {
    const transcript = event.results[0]?.transcript ?? '';
    setHeard(transcript);
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
    setHeard('');
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
    return <Text style={styles.hint}>🎤 Reconhecimento de fala indisponível neste aparelho — use os botões abaixo.</Text>;
  }

  if (phase === 'denied') {
    return <Text style={styles.hint}>🎤 Permissão de microfone negada — use os botões abaixo.</Text>;
  }

  if (phase === 'result' && verdict !== null) {
    return (
      <View style={styles.resultBox}>
        <Text style={styles.heard}>Você disse: “{heard}”</Text>
        <Text style={[styles.verdict, { color: verdict ? colors.successDeep : colors.warn }]}>
          {verdict ? '✅ Muito bem!' : '🔁 Quase lá, vamos tentar de novo!'}
        </Text>
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
      <Text style={styles.micLabel}>{phase === 'listening' ? 'Ouvindo... diga a palavra!' : 'Toque e fale a palavra'}</Text>
      {phase === 'listening' && heard ? <Text style={styles.interim}>“{heard}”</Text> : null}
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
  micIcon: { fontSize: 40, marginBottom: spacing.xs },
  micLabel: { ...typography.body, color: colors.ink, textAlign: 'center' },
  interim: { ...typography.caption, color: colors.inkSoft, marginTop: spacing.xs },
  resultBox: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  heard: { ...typography.caption, color: colors.inkSoft },
  verdict: { ...typography.title, marginTop: spacing.xs, textAlign: 'center' },
  hint: { ...typography.caption, color: colors.inkSoft, textAlign: 'center', width: '100%' },
});

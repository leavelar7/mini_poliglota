import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/theme';

interface Props {
  size?: number;
  mood?: 'happy' | 'cheer' | 'sleep';
}

const ACCENT: Record<NonNullable<Props['mood']>, string | null> = {
  happy: null,
  cheer: '✨',
  sleep: '💤',
};

// A real duck emoji on a soft pastel backdrop, not a custom vector drawing:
// guaranteed recognizable and friendly-looking, where a from-scratch mascot
// drawing risked reading as crude or unclear (as the hand-drawn version did).
export function DuckMascot({ size = 140, mood = 'happy' }: Props) {
  const accent = ACCENT[mood];
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View style={[styles.backdrop, { width: size, height: size, borderRadius: size / 2 }]} />
      <Text style={{ fontSize: size * 0.6 }}>🦆</Text>
      {accent && <Text style={[styles.accent, { fontSize: size * 0.24 }]}>{accent}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  backdrop: { position: 'absolute', backgroundColor: colors.cardAlt },
  accent: { position: 'absolute', top: '4%', right: '10%' },
});

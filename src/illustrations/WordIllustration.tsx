import React from 'react';
import { Text } from 'react-native';

interface Props {
  wordId: string;
  emojiFallback: string;
  size: number;
}

// Real emoji, not hand-drawn shapes: a 5-year-old who can't read yet needs
// the picture itself to say "moon" without any label — emoji are already
// professionally designed to be instantly recognizable at a glance, which a
// from-scratch vector icon set could not reliably match.
export function WordIllustration({ emojiFallback, size }: Props) {
  return <Text style={{ fontSize: size * 0.85 }}>{emojiFallback}</Text>;
}

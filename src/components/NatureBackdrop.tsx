import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors } from '../theme/theme';

interface Props {
  variant?: 'sky' | 'pond';
}

// A very quiet gradient-plus-hill backdrop — kept deliberately minimal (no
// sun, clouds, or pond ripples) so it reads as calm scenery rather than
// something competing for attention. Intentionally NOT used on the Session
// screen, where the child's focus needs to be on the word alone.
export function NatureBackdrop({ variant = 'sky' }: Props) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMax slice">
        <Defs>
          <LinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={variant === 'pond' ? colors.parchment : colors.pond} stopOpacity={variant === 'pond' ? 1 : 0.25} />
            <Stop offset="1" stopColor={colors.parchment} stopOpacity={1} />
          </LinearGradient>
        </Defs>

        <Path d="M0 0 H400 V800 H0 Z" fill="url(#skyGrad)" />
        <Path d="M0 740 Q120 715 240 735 T400 725 V800 H0 Z" fill={colors.forest} opacity={0.22} />
      </Svg>
    </View>
  );
}

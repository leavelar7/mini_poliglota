import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors } from '../theme/theme';

interface Props {
  variant?: 'sky' | 'pond';
}

// A soft, painterly hills-and-pond backdrop — the storybook forest setting
// behind every screen, standing in for hand-painted scenery rather than a
// flat cartoon color fill. Decoration is kept to a thin footer strip (not a
// dominant fill) so it reads well regardless of the device's aspect ratio —
// a tall phone crops the tall gradient above it, a wide screen just shows
// more of that same gradient.
export function NatureBackdrop({ variant = 'sky' }: Props) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMax slice">
        <Defs>
          <LinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={variant === 'pond' ? colors.parchment : colors.pond} stopOpacity={variant === 'pond' ? 1 : 0.4} />
            <Stop offset="1" stopColor={colors.parchment} stopOpacity={1} />
          </LinearGradient>
        </Defs>

        <Path d="M0 0 H400 V800 H0 Z" fill="url(#skyGrad)" />

        <Circle cx="330" cy="90" r="40" fill={colors.honey} opacity={0.5} />
        <Circle cx="55" cy="140" r="18" fill={colors.parchment} opacity={0.55} />
        <Circle cx="85" cy="140" r="13" fill={colors.parchment} opacity={0.55} />
        <Circle cx="105" cy="146" r="16" fill={colors.parchment} opacity={0.55} />

        {/* far hill — thin footer strip, not a dominant fill */}
        <Path d="M0 690 Q100 655 220 685 T400 670 V800 H0 Z" fill={colors.forest} opacity={0.3} />
        {/* near hill */}
        <Path d="M0 730 Q120 695 240 725 T400 710 V800 H0 Z" fill={colors.forest} opacity={0.45} />

        {/* pond sliver at the very bottom */}
        <Ellipse cx="200" cy="820" rx="260" ry="55" fill={colors.pond} opacity={0.45} />
        <Path d="M110 790 Q200 778 290 790" stroke={colors.pondDeep} strokeWidth={2.5} fill="none" opacity={0.35} strokeLinecap="round" />

        {/* tall grass */}
        {[18, 40, 355, 378].map((x, i) => (
          <Path
            key={x}
            d={`M${x} 800 Q${x + (i % 2 === 0 ? -6 : 6)} 775 ${x} 758`}
            stroke={colors.forestDeep}
            strokeWidth={3}
            fill="none"
            opacity={0.4}
            strokeLinecap="round"
          />
        ))}
      </Svg>
    </View>
  );
}

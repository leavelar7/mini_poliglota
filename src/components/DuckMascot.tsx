import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { colors } from '../theme/theme';

interface Props {
  size?: number;
  mood?: 'happy' | 'cheer' | 'wink' | 'sleep';
}

// A friendly duck mascot with a hand-inked, painterly storybook feel —
// visible ink outlines and a muted honey/rust palette — standing in for a
// bear, per the product brief, in the spirit of "O Pequeno Urso" (TV Cultura).
export function DuckMascot({ size = 140, mood = 'happy' }: Props) {
  const outline = { stroke: colors.ink, strokeWidth: 3 };
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Ellipse cx="100" cy="180" rx="55" ry="10" fill={colors.shadow} />
      {/* body */}
      <Ellipse cx="100" cy="120" rx="62" ry="52" fill={colors.honey} {...outline} />
      {/* belly */}
      <Ellipse cx="100" cy="132" rx="38" ry="30" fill={colors.cardAlt} />
      {/* wing */}
      <Ellipse cx="145" cy="118" rx="18" ry="26" fill={colors.honeyDeep} {...outline} />
      {/* head */}
      <Circle cx="100" cy="62" r="46" fill={colors.honey} {...outline} />
      {/* beak */}
      <Path d="M60 66 Q30 62 58 82 Q62 78 68 72 Z" fill={colors.rust} {...outline} />
      {/* eyes */}
      {mood === 'sleep' ? (
        <>
          <Path d="M80 55 Q88 48 96 55" stroke={colors.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M112 55 Q120 48 128 55" stroke={colors.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <Circle cx="88" cy="55" r="6" fill={colors.ink} />
          <Circle cx="120" cy="55" r="6" fill={colors.ink} />
          {mood === 'wink' ? null : (
            <>
              <Circle cx="90" cy="53" r="2" fill="#fff" />
              <Circle cx="122" cy="53" r="2" fill="#fff" />
            </>
          )}
        </>
      )}
      {/* cheeks */}
      <Circle cx="72" cy="68" r="7" fill={colors.rust} opacity={0.35} />
      <Circle cx="128" cy="68" r="7" fill={colors.rust} opacity={0.35} />
      {/* feet */}
      <Path d="M78 168 L70 182 L86 182 Z" fill={colors.rust} {...outline} />
      <Path d="M122 168 L114 182 L130 182 Z" fill={colors.rust} {...outline} />
    </Svg>
  );
}

import React from 'react';
import { Circle, Ellipse, G, Path } from 'react-native-svg';
import { colors } from '../theme/theme';

// Small reusable pieces shared across word illustrations so every icon reads
// as part of the same hand-inked storybook set (ink outline + muted fill)
// instead of 41 one-off drawings.

const outline = { stroke: colors.ink, strokeWidth: 3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export function CritterHead({ cx, cy, r, fill, ears }: { cx: number; cy: number; r: number; fill: string; ears: 'round' | 'pointy' | 'floppy' | 'tall' }) {
  return (
    <G>
      {ears === 'round' && (
        <>
          <Circle cx={cx - r * 0.7} cy={cy - r * 0.75} r={r * 0.32} fill={fill} {...outline} />
          <Circle cx={cx + r * 0.7} cy={cy - r * 0.75} r={r * 0.32} fill={fill} {...outline} />
        </>
      )}
      {ears === 'pointy' && (
        <>
          <Path d={`M${cx - r * 0.9} ${cy - r * 0.4} L${cx - r * 0.45} ${cy - r * 1.25} L${cx - r * 0.1} ${cy - r * 0.5} Z`} fill={fill} {...outline} />
          <Path d={`M${cx + r * 0.9} ${cy - r * 0.4} L${cx + r * 0.45} ${cy - r * 1.25} L${cx + r * 0.1} ${cy - r * 0.5} Z`} fill={fill} {...outline} />
        </>
      )}
      {ears === 'floppy' && (
        <>
          <Ellipse cx={cx - r * 0.95} cy={cy - r * 0.1} rx={r * 0.3} ry={r * 0.55} fill={fill} {...outline} />
          <Ellipse cx={cx + r * 0.95} cy={cy - r * 0.1} rx={r * 0.3} ry={r * 0.55} fill={fill} {...outline} />
        </>
      )}
      {ears === 'tall' && (
        <>
          <Ellipse cx={cx - r * 0.5} cy={cy - r * 1.3} rx={r * 0.28} ry={r * 0.75} fill={fill} {...outline} />
          <Ellipse cx={cx + r * 0.5} cy={cy - r * 1.3} rx={r * 0.28} ry={r * 0.75} fill={fill} {...outline} />
        </>
      )}
      <Circle cx={cx} cy={cy} r={r} fill={fill} {...outline} />
    </G>
  );
}

export function Eyes({ cx, cy, spread = 12, r = 4 }: { cx: number; cy: number; spread?: number; r?: number }) {
  return (
    <G>
      <Circle cx={cx - spread} cy={cy} r={r} fill={colors.ink} />
      <Circle cx={cx + spread} cy={cy} r={r} fill={colors.ink} />
    </G>
  );
}

export function Snout({ cx, cy, rx, ry, fill }: { cx: number; cy: number; rx: number; ry: number; fill: string }) {
  return (
    <G>
      <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} {...outline} />
      <Circle cx={cx} cy={cy - ry * 0.15} r={rx * 0.22} fill={colors.ink} />
    </G>
  );
}

export function Blob({ cx, cy, rx, ry, fill }: { cx: number; cy: number; rx: number; ry: number; fill: string }) {
  return <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} {...outline} />;
}

export const inkOutline = outline;

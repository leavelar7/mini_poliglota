import React from 'react';
import { Text } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme/theme';
import { CritterHead, Eyes, Snout, inkOutline } from './shapes';

interface Props {
  wordId: string;
  emojiFallback: string;
  size: number;
}

const paintBlobPath = 'M60 20 C80 22 96 36 94 56 C92 78 76 96 56 94 C36 92 22 76 24 56 C26 34 40 18 60 20 Z';

function PaintSwatch({ fill }: { fill: string }) {
  return (
    <G>
      <Path d={paintBlobPath} fill={fill} {...inkOutline} />
      <Ellipse cx={46} cy={40} rx={12} ry={7} fill="#ffffff" opacity={0.35} />
    </G>
  );
}

function NumberBadge({ n }: { n: string }) {
  return (
    <G>
      <Circle cx={60} cy={60} r={38} fill={colors.honeyDeep} {...inkOutline} />
      <Circle cx={60} cy={60} r={30} fill={colors.cardAlt} {...inkOutline} />
      <SvgText x={60} y={75} fontSize={42} fontWeight="800" fill={colors.ink} textAnchor="middle">
        {n}
      </SvgText>
    </G>
  );
}

function PersonSilhouette({ hair, body }: { hair: string; body: string }) {
  return (
    <G>
      <Path d="M30 40 Q60 16 90 40 L90 52 Q60 30 30 52 Z" fill={hair} {...inkOutline} />
      <Circle cx={60} cy={48} r={22} fill={colors.card} {...inkOutline} />
      <Path d="M32 108 Q34 66 60 66 Q86 66 88 108 Z" fill={body} {...inkOutline} />
      <Eyes cx={60} cy={48} spread={9} r={3} />
    </G>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  sun: (
    <G>
      {[
        [94, 60, 106, 60],
        [84, 84, 93, 93],
        [60, 94, 60, 106],
        [36, 84, 27, 93],
        [26, 60, 14, 60],
        [36, 36, 27, 27],
        [60, 26, 60, 14],
        [84, 36, 93, 27],
      ].map(([x1, y1, x2, y2], i) => (
        <Path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={colors.honeyDeep} strokeWidth={5} strokeLinecap="round" />
      ))}
      <Circle cx={60} cy={60} r={26} fill={colors.honey} {...inkOutline} />
    </G>
  ),
  moon: (
    <G>
      <Circle cx={40} cy={35} r={3} fill={colors.honey} />
      <Circle cx={30} cy={55} r={2} fill={colors.honey} />
      <Path d="M74 26 A32 32 0 1 0 74 94 A24 24 0 1 1 74 26 Z" fill={colors.plum} {...inkOutline} />
    </G>
  ),
  water: (
    <G>
      <Path d="M45 30 C55 48 62 60 62 72 C62 84 53 92 45 92 C37 92 28 84 28 72 C28 60 35 48 45 30 Z" fill={colors.pond} {...inkOutline} />
      <Path d="M84 55 C90 66 94 74 94 82 C94 89 89 94 84 94 C79 94 74 89 74 82 C74 74 78 66 84 55 Z" fill={colors.pondDeep} {...inkOutline} opacity={0.9} />
    </G>
  ),
  tree: (
    <G>
      <Rect x={52} y={72} width={16} height={34} rx={4} fill={colors.honeyDeep} {...inkOutline} />
      <Circle cx={40} cy={54} r={17} fill={colors.forest} {...inkOutline} />
      <Circle cx={80} cy={54} r={17} fill={colors.forest} {...inkOutline} />
      <Circle cx={60} cy={40} r={24} fill={colors.forest} {...inkOutline} />
    </G>
  ),
  flower: (
    <G>
      <Rect x={57} y={65} width={6} height={38} fill={colors.forest} />
      <Ellipse cx={78} cy={88} rx={10} ry={5} fill={colors.forest} {...inkOutline} rotation={-30} origin="78,88" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <Ellipse key={deg} cx={60} cy={38} rx={13} ry={19} fill={colors.rust} {...inkOutline} rotation={deg} origin="60,55" />
      ))}
      <Circle cx={60} cy={55} r={11} fill={colors.honey} {...inkOutline} />
    </G>
  ),
  star: (
    <Path
      d="M60,28 L67.6,49.5 L90.4,50.1 L72.4,64.0 L78.8,85.9 L60,73 L41.2,85.9 L47.6,64.0 L29.6,50.1 L52.4,49.5 Z"
      fill={colors.honey}
      {...inkOutline}
    />
  ),
  dog: (
    <G>
      <CritterHead cx={60} cy={58} r={32} fill={colors.honey} ears="floppy" />
      <Snout cx={60} cy={76} rx={16} ry={12} fill={colors.cardAlt} />
      <Eyes cx={60} cy={50} spread={12} />
    </G>
  ),
  cat: (
    <G>
      <CritterHead cx={60} cy={60} r={30} fill={colors.honeyDeep} ears="pointy" />
      <Path d="M55 66 L65 66 L60 72 Z" fill={colors.rust} />
      <Eyes cx={60} cy={54} spread={11} />
      {[[-30, 68], [-32, 74], [30, 68], [32, 74]].map(([dx, y], i) => (
        <Path key={i} d={`M${60 + (dx > 0 ? 12 : -12)} ${y} L${60 + dx} ${y}`} stroke={colors.ink} strokeWidth={2} opacity={0.6} strokeLinecap="round" />
      ))}
    </G>
  ),
  duck: (
    <G>
      <Ellipse cx={62} cy={78} rx={12} ry={16} fill={colors.honeyDeep} {...inkOutline} />
      <Circle cx={58} cy={50} r={28} fill={colors.honey} {...inkOutline} />
      <Path d="M32 52 Q14 48 30 62 Q36 58 42 54 Z" fill={colors.rust} {...inkOutline} />
      <Circle cx={64} cy={44} r={4} fill={colors.ink} />
    </G>
  ),
  fish: (
    <G>
      <Path d="M84 60 L104 44 L100 60 L104 76 Z" fill={colors.pondDeep} {...inkOutline} />
      <Ellipse cx={52} cy={60} rx={32} ry={20} fill={colors.pond} {...inkOutline} />
      <Path d="M46 44 Q54 36 62 44 Q54 48 46 44 Z" fill={colors.pondDeep} opacity={0.8} />
      <Circle cx={32} cy={56} r={4} fill={colors.ink} />
    </G>
  ),
  bird: (
    <G>
      <Ellipse cx={54} cy={68} rx={26} ry={22} fill={colors.rust} {...inkOutline} />
      <Circle cx={82} cy={48} r={17} fill={colors.rust} {...inkOutline} />
      <Path d="M96 46 L110 50 L96 54 Z" fill={colors.honey} {...inkOutline} />
      <Ellipse cx={44} cy={70} rx={14} ry={9} fill={colors.forest} {...inkOutline} rotation={-20} origin="44,70" />
      <Circle cx={86} cy={44} r={3} fill={colors.ink} />
    </G>
  ),
  bear: (
    <G>
      <CritterHead cx={60} cy={60} r={32} fill={colors.honeyDeep} ears="round" />
      <Snout cx={60} cy={78} rx={15} ry={11} fill={colors.cardAlt} />
      <Eyes cx={60} cy={52} spread={12} />
    </G>
  ),
  rabbit: (
    <G>
      <CritterHead cx={60} cy={76} r={26} fill={colors.cardAlt} ears="tall" />
      <Ellipse cx={45} cy={40} rx={9} ry={20} fill={colors.rust} rotation={-8} origin="45,40" opacity={0.5} />
      <Ellipse cx={75} cy={40} rx={9} ry={20} fill={colors.rust} rotation={8} origin="75,40" opacity={0.5} />
      <Path d="M56 82 L64 82 L60 87 Z" fill={colors.rust} />
      <Eyes cx={60} cy={70} spread={11} />
    </G>
  ),
  cow: (
    <G>
      <CritterHead cx={60} cy={62} r={30} fill={colors.card} ears="round" />
      <Path d="M42 38 L36 22 M78 38 L84 22" stroke={colors.honeyDeep} strokeWidth={6} strokeLinecap="round" />
      <Ellipse cx={44} cy={54} rx={9} ry={7} fill={colors.ink} opacity={0.75} rotation={-10} origin="44,54" />
      <Ellipse cx={78} cy={68} rx={7} ry={10} fill={colors.ink} opacity={0.75} rotation={15} origin="78,68" />
      <Snout cx={60} cy={80} rx={15} ry={10} fill={colors.cardAlt} />
      <Eyes cx={60} cy={54} spread={12} />
    </G>
  ),
  butterfly: (
    <G>
      <Path d="M60 40 L60 90" stroke={colors.ink} strokeWidth={4} strokeLinecap="round" />
      <Ellipse cx={36} cy={45} rx={20} ry={15} fill={colors.rust} {...inkOutline} rotation={-15} origin="36,45" />
      <Ellipse cx={84} cy={45} rx={20} ry={15} fill={colors.rust} {...inkOutline} rotation={15} origin="84,45" />
      <Ellipse cx={40} cy={78} rx={15} ry={11} fill={colors.pond} {...inkOutline} rotation={-10} origin="40,78" />
      <Ellipse cx={80} cy={78} rx={15} ry={11} fill={colors.pond} {...inkOutline} rotation={10} origin="80,78" />
      <Path d="M60 40 Q54 30 48 32 M60 40 Q66 30 72 32" stroke={colors.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
    </G>
  ),
  apple: (
    <G>
      <Rect x={57} y={22} width={6} height={14} fill={colors.forestDeep} />
      <Ellipse cx={76} cy={30} rx={12} ry={7} fill={colors.forest} {...inkOutline} rotation={-25} origin="76,30" />
      <Circle cx={60} cy={68} r={30} fill={colors.rust} {...inkOutline} />
    </G>
  ),
  banana: (
    <G>
      <Path
        d="M34 84 C30 60 40 34 66 26 C70 25 74 28 72 32 C54 40 46 60 50 82 C58 96 78 96 90 82 C93 79 98 82 95 87 C82 104 50 106 34 84 Z"
        fill={colors.honey}
        {...inkOutline}
      />
      <Ellipse cx={68} cy={28} rx={5} ry={4} fill={colors.honeyDeep} {...inkOutline} />
    </G>
  ),
  bread: (
    <G>
      <Rect x={22} y={50} width={76} height={44} rx={20} fill={colors.honeyDeep} {...inkOutline} />
      <Path d="M40 50 Q46 38 40 28 M60 50 Q66 36 60 24 M80 50 Q86 38 80 28" stroke={colors.honeyDeep} strokeWidth={10} fill="none" strokeLinecap="round" />
      <Path d="M38 66 Q60 58 82 66 M38 78 Q60 72 82 78" stroke={colors.ink} strokeWidth={2.5} fill="none" opacity={0.4} strokeLinecap="round" />
    </G>
  ),
  milk: (
    <G>
      <Path d="M46 22 H74 L78 40 H42 Z" fill={colors.cardAlt} {...inkOutline} />
      <Path d="M42 40 H78 V96 Q78 100 74 100 H46 Q42 100 42 96 Z" fill={colors.card} {...inkOutline} />
      <Rect x={42} y={62} width={36} height={38} fill={colors.pond} opacity={0.6} />
    </G>
  ),
  egg: (
    <G>
      <Path d="M60 22 C78 22 90 52 90 72 C90 92 76 102 60 102 C44 102 30 92 30 72 C30 52 42 22 60 22 Z" fill={colors.cardAlt} {...inkOutline} />
      <Circle cx={50} cy={56} r={3} fill={colors.honeyDeep} opacity={0.6} />
      <Circle cx={68} cy={68} r={2.5} fill={colors.honeyDeep} opacity={0.6} />
      <Circle cx={56} cy={78} r={2} fill={colors.honeyDeep} opacity={0.6} />
    </G>
  ),
  cake: (
    <G>
      <Rect x={26} y={64} width={68} height={32} rx={6} fill={colors.rust} {...inkOutline} />
      <Path d="M22 64 Q60 50 98 64 Q60 78 22 64 Z" fill={colors.cardAlt} {...inkOutline} />
      <Rect x={57} y={30} width={6} height={22} fill={colors.honeyDeep} />
      <Path d="M60 22 C64 26 64 32 60 34 C56 32 56 26 60 22 Z" fill={colors.rustDeep} {...inkOutline} />
    </G>
  ),
  house: (
    <G>
      <Path d="M22 58 L60 26 L98 58 Z" fill={colors.rust} {...inkOutline} />
      <Rect x={30} y={58} width={60} height={42} fill={colors.honey} {...inkOutline} />
      <Rect x={54} y={76} width={16} height={24} fill={colors.pond} {...inkOutline} />
      <Circle cx={40} cy={72} r={7} fill={colors.cardAlt} {...inkOutline} />
    </G>
  ),
  door: (
    <G>
      <Rect x={38} y={20} width={44} height={82} rx={10} fill={colors.honeyDeep} {...inkOutline} />
      <Circle cx={70} cy={62} r={4} fill={colors.ink} />
    </G>
  ),
  bed: (
    <G>
      <Rect x={20} y={68} width={80} height={26} rx={8} fill={colors.pond} {...inkOutline} />
      <Rect x={20} y={44} width={80} height={26} rx={10} fill={colors.honeyDeep} opacity={0.25} />
      <Rect x={26} y={46} width={26} height={20} rx={8} fill={colors.cardAlt} {...inkOutline} />
      <Rect x={20} y={68} width={80} height={9} fill={colors.rust} opacity={0.7} />
    </G>
  ),
  ball: (
    <G>
      <Circle cx={60} cy={60} r={38} fill={colors.card} {...inkOutline} />
      <Path d="M60 22 Q80 60 60 98 Q40 60 60 22 Z" fill={colors.rust} opacity={0.85} />
      <Path d="M24 44 Q60 60 96 44 M24 76 Q60 60 96 76" stroke={colors.pond} strokeWidth={5} fill="none" strokeLinecap="round" />
    </G>
  ),
  book: (
    <G>
      <Rect x={24} y={26} width={72} height={68} rx={6} fill={colors.rust} {...inkOutline} />
      <Rect x={32} y={34} width={56} height={52} rx={3} fill={colors.cardAlt} />
      <Path d="M60 34 V86" stroke={colors.ink} strokeWidth={3} opacity={0.5} />
    </G>
  ),
  car: (
    <G>
      <Path d="M22 72 Q26 50 44 48 H76 Q94 50 98 72 Z" fill={colors.pond} {...inkOutline} />
      <Rect x={22} y={72} width={76} height={14} rx={6} fill={colors.pond} {...inkOutline} />
      <Rect x={40} y={52} width={40} height={16} rx={4} fill={colors.cardAlt} {...inkOutline} />
      <Circle cx={38} cy={88} r={11} fill={colors.ink} />
      <Circle cx={82} cy={88} r={11} fill={colors.ink} />
    </G>
  ),
  boat: (
    <G>
      <Path d="M60 24 L60 62 L94 62 Z" fill={colors.card} {...inkOutline} />
      <Rect x={58} y={24} width={4} height={40} fill={colors.ink} />
      <Path d="M18 66 H102 L88 92 H32 Z" fill={colors.honeyDeep} {...inkOutline} />
    </G>
  ),
  balloon: (
    <G>
      <Path d="M60 92 Q52 100 56 108 Q60 112 64 108 Q68 100 60 92 Z" fill={colors.rust} />
      <Path d="M60 92 Q40 78 60 90" stroke={colors.ink} strokeWidth={2} fill="none" opacity={0.5} />
      <Ellipse cx={60} cy={54} rx={30} ry={36} fill={colors.rust} {...inkOutline} />
      <Ellipse cx={50} cy={38} rx={8} ry={12} fill="#ffffff" opacity={0.3} />
    </G>
  ),
  head: (
    <G>
      <Circle cx={60} cy={58} r={34} fill={colors.honey} {...inkOutline} />
      <Ellipse cx={94} cy={58} rx={7} ry={11} fill={colors.honey} {...inkOutline} />
      <Eyes cx={60} cy={54} spread={12} />
      <Path d="M48 76 Q60 84 72 76" stroke={colors.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
    </G>
  ),
  hand: (
    <G>
      <Ellipse cx={60} cy={80} rx={26} ry={22} fill={colors.honey} {...inkOutline} />
      {[-40, -20, 0, 20, 40].map((deg, i) => (
        <Ellipse key={deg} cx={60} cy={38} rx={8} ry={i === 2 ? 24 : 20} fill={colors.honey} {...inkOutline} rotation={deg} origin="60,58" />
      ))}
    </G>
  ),
  eye: (
    <G>
      <Path d="M18 60 Q60 24 102 60 Q60 96 18 60 Z" fill={colors.card} {...inkOutline} />
      <Circle cx={60} cy={60} r={20} fill={colors.pond} {...inkOutline} />
      <Circle cx={60} cy={60} r={9} fill={colors.ink} />
      <Circle cx={55} cy={54} r={3} fill="#ffffff" />
    </G>
  ),
  foot: (
    <G>
      <Path d="M34 70 Q28 40 48 32 Q66 26 70 46 Q74 62 90 66 Q100 70 96 84 Q90 100 60 100 Q36 100 34 70 Z" fill={colors.honey} {...inkOutline} />
      {[0, 1, 2, 3].map((i) => (
        <Circle key={i} cx={78 + i * 9} cy={62 - i * 3} r={6} fill={colors.honey} {...inkOutline} />
      ))}
    </G>
  ),
  mother: <PersonSilhouette hair={colors.honeyDeep} body={colors.rust} />,
  father: <PersonSilhouette hair={colors.forestDeep} body={colors.pond} />,
  friend: (
    <G>
      <G transform="translate(-14, 6) scale(0.72)">
        <PersonSilhouette hair={colors.honeyDeep} body={colors.rust} />
      </G>
      <G transform="translate(14, 6) scale(0.72)">
        <PersonSilhouette hair={colors.forestDeep} body={colors.pond} />
      </G>
    </G>
  ),
  one: <NumberBadge n="1" />,
  two: <NumberBadge n="2" />,
  three: <NumberBadge n="3" />,
  red: <PaintSwatch fill={colors.rust} />,
  blue: <PaintSwatch fill={colors.pond} />,
  yellow: <PaintSwatch fill={colors.honey} />,
};

export function WordIllustration({ wordId, emojiFallback, size }: Props) {
  const icon = ICONS[wordId];
  if (!icon) {
    return <Text style={{ fontSize: size * 0.8 }}>{emojiFallback}</Text>;
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      {icon}
    </Svg>
  );
}

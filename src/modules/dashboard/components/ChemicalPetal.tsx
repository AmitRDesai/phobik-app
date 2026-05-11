import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import type { ViewStyle } from 'react-native';
import { EaseView } from 'react-native-ease';

export type PetalShape = 'tl' | 'tr' | 'bl' | 'br';

interface ChemicalPetalProps {
  pillarLabel: string;
  chemicalLabel: string;
  score: number;
  color: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  isLowest: boolean;
  /** Quadrant position in the 2x2 grid — drives the organic blob border-radius */
  shape?: PetalShape;
}

// Organic blob border-radii from the design (top-left, top-right,
// bottom-right, bottom-left). RN doesn't support the elliptical `/` syntax
// (separate horizontal/vertical radii), so the H values are used as
// percentages — close enough to the design's hand-drawn feel.
const SHAPE_RADIUS: Record<PetalShape, ViewStyle> = {
  tl: {
    borderTopLeftRadius: '40%',
    borderTopRightRadius: '60%',
    borderBottomRightRadius: '70%',
    borderBottomLeftRadius: '30%',
  },
  tr: {
    borderTopLeftRadius: '60%',
    borderTopRightRadius: '40%',
    borderBottomRightRadius: '30%',
    borderBottomLeftRadius: '70%',
  },
  bl: {
    borderTopLeftRadius: '30%',
    borderTopRightRadius: '70%',
    borderBottomRightRadius: '40%',
    borderBottomLeftRadius: '60%',
  },
  br: {
    borderTopLeftRadius: '70%',
    borderTopRightRadius: '30%',
    borderBottomRightRadius: '60%',
    borderBottomLeftRadius: '40%',
  },
};

export function ChemicalPetal({
  pillarLabel,
  chemicalLabel,
  score,
  color,
  icon,
  isLowest,
  shape,
}: ChemicalPetalProps) {
  const content = (
    <View
      className="flex-1 items-center justify-center"
      style={{
        ...(shape ? SHAPE_RADIUS[shape] : { borderRadius: 24 }),
        borderWidth: isLowest ? 2 : 1,
        borderColor: withAlpha(color, isLowest ? 0.55 : 0.2),
        backgroundColor: withAlpha(color, isLowest ? 0.1 : 0.05),
        aspectRatio: 1,
        padding: 16,
      }}
    >
      <View className="flex-row items-center gap-1">
        <MaterialIcons name={icon} size={14} color={color} />
        <Text
          size="xs"
          treatment="caption"
          weight="bold"
          className="tracking-widest"
          style={{ color }}
        >
          {pillarLabel}
        </Text>
      </View>
      <Text weight="black" className="mt-2 text-4xl" allowFontScaling={false}>
        {score}
      </Text>
      <Text
        size="xs"
        weight="bold"
        className="mt-1 uppercase tracking-widest"
        style={{ color: withAlpha(color, 0.7) }}
      >
        {chemicalLabel}
      </Text>
    </View>
  );

  if (!isLowest) return content;
  return (
    <EaseView
      initialAnimate={{ scale: 1, opacity: 1 }}
      animate={{ scale: 1.03, opacity: 0.9 }}
      transition={{ type: 'timing', duration: 1500, loop: 'reverse' }}
      style={{ flex: 1 }}
    >
      {content}
    </EaseView>
  );
}

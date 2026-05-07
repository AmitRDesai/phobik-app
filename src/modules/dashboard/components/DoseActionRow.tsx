import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const CHEMICAL_MAX = 25;

type DoseStatus = 'check' | 'critical' | 'neutral';

interface DoseActionRowProps {
  label: string;
  score: number;
  color: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  status: DoseStatus;
  /** Optional tap-to-boost handler for the trailing CTA. */
  onBoost?: () => void;
}

function TrailingAction({
  status,
  color,
  onBoost,
}: {
  status: DoseStatus;
  color: string;
  onBoost?: () => void;
}) {
  const scheme = useScheme();

  if (status === 'critical') {
    return (
      <Pressable
        onPress={onBoost}
        className="active:scale-95"
        style={{
          backgroundColor: color,
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 9999,
          boxShadow: `0 0 12px ${withAlpha(color, 0.4)}`,
        }}
      >
        <Text variant="xs" className="font-black tracking-widest text-white">
          BOOST
        </Text>
      </Pressable>
    );
  }

  if (status === 'check') {
    return (
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: withAlpha(color, 0.18) }}
      >
        <MaterialIcons name="check" size={18} color={color} />
      </View>
    );
  }

  return (
    <View className="h-9 w-9 items-center justify-center rounded-full border border-foreground/10 bg-foreground/[0.04]">
      <MaterialIcons
        name="bolt"
        size={16}
        color={foregroundFor(scheme, 0.45)}
      />
    </View>
  );
}

function MiniRing({ score, color }: { score: number; color: string }) {
  const size = 48;
  const stroke = 3;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const c = 2 * Math.PI * r;
  const progress = Math.max(0, Math.min(1, score / CHEMICAL_MAX));
  return (
    <Svg
      width={size}
      height={size}
      style={{ transform: [{ rotate: '-90deg' }] }}
    >
      <Circle
        cx={cx}
        cy={cy}
        r={r}
        stroke={withAlpha(color, 0.15)}
        strokeWidth={stroke}
        fill="transparent"
      />
      <Circle
        cx={cx}
        cy={cy}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
        strokeLinecap="round"
        fill="transparent"
      />
    </Svg>
  );
}

export function DoseActionRow({
  label,
  score,
  color,
  icon,
  status,
  onBoost,
}: DoseActionRowProps) {
  const isCritical = status === 'critical';
  return (
    <Card
      variant="elevated"
      className="flex-row items-center gap-4 p-4"
      style={{
        backgroundColor: withAlpha(color, isCritical ? 0.07 : 0.035),
        borderWidth: 1,
        borderColor: withAlpha(color, isCritical ? 0.35 : 0.12),
        borderLeftWidth: 3,
        borderLeftColor: withAlpha(color, isCritical ? 0.85 : 0.6),
      }}
    >
      <View className="relative h-12 w-12 items-center justify-center">
        <MiniRing score={score} color={color} />
        <View
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          className="items-center justify-center"
          pointerEvents="none"
        >
          <View
            className="h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: withAlpha(color, 0.14) }}
          >
            <MaterialIcons name={icon} size={16} color={color} />
          </View>
        </View>
      </View>

      <View className="flex-1">
        <Text
          variant="caption"
          className="font-bold tracking-widest"
          style={{ color }}
        >
          {label}
        </Text>
        <View className="mt-1 flex-row items-baseline gap-1">
          <Text
            className="text-xl font-black text-foreground"
            allowFontScaling={false}
          >
            {score}
          </Text>
          <Text variant="xs" muted className="font-semibold">
            / {CHEMICAL_MAX}
          </Text>
        </View>
      </View>

      <TrailingAction status={status} color={color} onBoost={onBoost} />
    </Card>
  );
}

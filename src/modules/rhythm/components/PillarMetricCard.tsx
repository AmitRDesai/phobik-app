import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { accentFor, type AccentHue } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface PillarMetricCardProps {
  icon: IoniconName;
  label: string;
  value: string;
  unit?: string;
  /** Short tone-colored status line (e.g. "Optimal", "Stable", "84%"). */
  status?: string;
  /** Small muted note under the value (e.g. "Range: 7-9h"). */
  note?: string;
  tone: AccentHue;
}

/**
 * Compact metric tile for the pillar detail screens — icon, big value + unit,
 * label, optional tone-colored status, and a muted note. Designed to sit
 * three-across in a `flex-row gap-3`.
 */
export function PillarMetricCard({
  icon,
  label,
  value,
  unit,
  status,
  note,
  tone,
}: PillarMetricCardProps) {
  const scheme = useScheme();
  const toneColor = accentFor(scheme, tone);

  return (
    <Card variant="flat" size="sm" className="w-full gap-1">
      <View className="flex-row items-center justify-between">
        <Ionicons name={icon} size={18} color={toneColor} />
        {status ? (
          <Text size="xs" treatment="caption" style={{ color: toneColor }}>
            {status}
          </Text>
        ) : null}
      </View>
      <View className="mt-1 flex-row items-baseline gap-0.5">
        <Text size="lg" weight="black" allowFontScaling={false}>
          {value}
        </Text>
        {unit ? (
          <Text size="xs" tone="secondary">
            {unit}
          </Text>
        ) : null}
      </View>
      <Text size="xs" treatment="caption" tone="secondary">
        {label}
      </Text>
      {note ? (
        <Text size="xs" tone="tertiary">
          {note}
        </Text>
      ) : null}
    </Card>
  );
}

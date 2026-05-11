import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { accentFor, colors } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { MaterialIcons } from '@expo/vector-icons';

export function WearableValueCard() {
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  const { heartRate, hrv } = useLatestBiometrics();

  return (
    <Card variant="raised" size="lg">
      <View className="mb-4 flex-row items-center gap-2">
        <MaterialIcons name="favorite" size={16} color={colors.primary.pink} />
        <Text
          size="xs"
          treatment="caption"
          weight="bold"
          style={{ color: colors.primary.pink }}
        >
          Wearable Status
        </Text>
      </View>

      <View className="flex-row gap-6">
        <View className="flex-1">
          <Text
            size="xs"
            treatment="caption"
            tone="secondary"
            weight="bold"
            className="mb-1"
          >
            Heart Rate
          </Text>
          <View className="flex-row items-baseline gap-1.5">
            <Text
              weight="black"
              className="text-4xl leading-none"
              allowFontScaling={false}
            >
              {heartRate != null ? heartRate : '—'}
            </Text>
            <Text
              size="sm"
              tone="accent"
              weight="bold"
              className="uppercase tracking-tighter"
            >
              Bpm
            </Text>
          </View>
        </View>
        <View className="flex-1">
          <Text
            size="xs"
            treatment="caption"
            tone="secondary"
            weight="bold"
            className="mb-1"
          >
            HRV Balance
          </Text>
          <View className="flex-row items-baseline gap-1.5">
            <Text
              weight="black"
              className="text-4xl leading-none"
              allowFontScaling={false}
            >
              {hrv != null ? hrv.toFixed(1) : '—'}
            </Text>
            <Text
              size="sm"
              weight="bold"
              className="uppercase tracking-tighter"
              style={{ color: yellow }}
            >
              Ms
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

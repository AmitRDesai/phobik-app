import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { accentFor, colors } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { MaterialIcons } from '@expo/vector-icons';

export function WearableValueCard() {
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  const { heartRate, hrv } = useLatestBiometrics();

  return (
    <DashboardCard>
      <View className="mb-4 flex-row items-center gap-2">
        <MaterialIcons name="favorite" size={16} color={colors.primary.pink} />
        <Text
          variant="caption"
          className="font-bold"
          style={{ color: colors.primary.pink }}
        >
          Wearable Status
        </Text>
      </View>

      <View className="flex-row gap-6">
        <View className="flex-1">
          <Text variant="caption" muted className="mb-1 font-bold">
            Heart Rate
          </Text>
          <View className="flex-row items-baseline gap-1.5">
            <Text
              className="text-4xl font-black leading-none text-foreground"
              allowFontScaling={false}
            >
              {heartRate != null ? heartRate : '—'}
            </Text>
            <Text
              variant="sm"
              className="font-bold uppercase tracking-tighter text-primary-pink"
            >
              Bpm
            </Text>
          </View>
        </View>
        <View className="flex-1">
          <Text variant="caption" muted className="mb-1 font-bold">
            HRV Balance
          </Text>
          <View className="flex-row items-baseline gap-1.5">
            <Text
              className="text-4xl font-black leading-none text-foreground"
              allowFontScaling={false}
            >
              {hrv != null ? hrv.toFixed(1) : '—'}
            </Text>
            <Text
              variant="sm"
              className="font-bold uppercase tracking-tighter"
              style={{ color: yellow }}
            >
              Ms
            </Text>
          </View>
        </View>
      </View>
    </DashboardCard>
  );
}

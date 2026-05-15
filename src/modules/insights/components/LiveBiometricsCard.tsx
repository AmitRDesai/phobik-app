import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BiometricStatCard } from '@/components/ui/BiometricStatCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Platform } from 'react-native';

const PROVIDER_LABEL =
  Platform.OS === 'ios' ? 'Apple Health' : 'Health Connect';

function formatRelative(date: Date | null): string {
  if (!date) return 'No recent samples';
  const ms = Date.now() - date.getTime();
  const minutes = Math.round(ms / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} d ago`;
}

export function LiveBiometricsCard() {
  const { heartRate, hrv, heartRateAt, hrvAt, hasAccess } =
    useLatestBiometrics();

  if (!hasAccess) {
    return (
      <Card variant="raised" size="lg">
        <View className="items-center gap-3 py-2">
          <Text size="md" weight="semibold" align="center">
            Not connected
          </Text>
          <Text
            size="sm"
            tone="secondary"
            align="center"
            className="max-w-[280px]"
          >
            Connect {PROVIDER_LABEL} to see live heart rate and HRV from your
            wearable.
          </Text>
          <Button
            variant="primary"
            size="sm"
            onPress={() => router.push('/settings/health')}
            prefixIcon={
              <MaterialIcons name="favorite" size={16} color="white" />
            }
          >
            Connect to {PROVIDER_LABEL}
          </Button>
        </View>
      </Card>
    );
  }

  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <BiometricStatCard
          className="flex-1"
          size="md"
          label="Heart Rate"
          value={heartRate != null ? String(heartRate) : '—'}
          unit="BPM"
          tone="pink"
          isStale={heartRate == null}
          icon={(color) => (
            <MaterialIcons name="favorite" size={14} color={color} />
          )}
        />
        <BiometricStatCard
          className="flex-1"
          size="md"
          label="HRV"
          value={hrv != null ? hrv.toFixed(1) : '—'}
          unit="MS"
          tone="yellow"
          isStale={hrv == null}
          icon={(color) => (
            <MaterialIcons name="show-chart" size={14} color={color} />
          )}
        />
      </View>
      <View className="flex-row justify-between px-1">
        <Text size="xs" treatment="caption" tone="tertiary">
          HR · {formatRelative(heartRateAt)}
        </Text>
        <Text size="xs" treatment="caption" tone="tertiary">
          HRV · {formatRelative(hrvAt)}
        </Text>
      </View>
    </View>
  );
}

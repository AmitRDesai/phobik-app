import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function ConnectHealthCard() {
  const router = useRouter();
  return (
    <DashboardCard glow>
      <GlowBg
        centerX={1}
        centerY={0}
        intensity={1}
        radius={0.35}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        bgClassName="bg-transparent"
      />
      <View className="items-center gap-4 py-2">
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-foreground/5">
          <MaterialIcons name="watch" size={28} color={colors.primary.pink} />
        </View>
        <View className="items-center">
          <Text size="h2">Connect your wearable</Text>
          <Text size="sm" align="center" className="mt-1 text-foreground/60">
            Sleep score and live BPM/HRV start syncing the moment health data is
            connected.
          </Text>
        </View>
        <Button
          variant="primary"
          size="default"
          onPress={() => router.push('/connect-wearable')}
          prefixIcon={
            <MaterialIcons name="link" size={16} color={colors.primary.pink} />
          }
        >
          Connect now
        </Button>
      </View>
    </DashboardCard>
  );
}

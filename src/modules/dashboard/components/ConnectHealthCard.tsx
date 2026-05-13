import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function ConnectHealthCard() {
  const router = useRouter();
  return (
    <Card
      variant="raised"
      size="lg"
      shadow={{
        color: colors.primary.pink,
        opacity: 0.1,
        blur: 24,
        offsetY: 8,
      }}
    >
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
          onPress={() => router.push('/connect-wearable')}
          prefixIcon={
            <MaterialIcons name="link" size={16} color={colors.white} />
          }
        >
          Connect now
        </Button>
      </View>
    </Card>
  );
}

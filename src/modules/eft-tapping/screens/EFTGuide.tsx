import HAND_IMAGE from '@/assets/images/daily-flow/eft-side-of-hand.png';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { Screen } from '@/components/ui/Screen';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';

import { EFTPointCard } from '../components/EFTPointCard';
import { EFT_POINTS } from '../data/eftPoints';

/**
 * Restored EFT-tapping POC (removed in commit ae33c9d, "new daily flow").
 * Originally a daily-flow sub-step gated on an active PowerSync session; here
 * it runs standalone and chains forward within `/dev/pocs/eft/`.
 */
export default function EFTGuide() {
  const router = useRouter();

  return (
    <Screen
      scroll
      transparent
      insetTop={false}
      sticky={
        <Button onPress={() => router.push('/dev/pocs/eft/toh-focus')}>
          Continue
        </Button>
      }
      className="px-6"
    >
      <View className="mt-2">
        <View className="flex-row flex-wrap items-baseline">
          <Text weight="black" className="text-[34px] leading-tight">
            EFT Tapping
          </Text>
        </View>
        <GradientText className="text-[34px] font-black leading-tight">
          Points Quick Tutorial
        </GradientText>
        <Text size="sm" tone="secondary" className="mt-3 leading-5">
          Follow the sequence below to release emotional blocks and restore
          balance.
        </Text>
      </View>

      <View className="mt-5 items-center">
        <View
          className="w-full overflow-hidden rounded-2xl border border-foreground/5 bg-foreground/[0.03]"
          style={{ aspectRatio: 1 }}
        >
          <Image
            source={HAND_IMAGE}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
      </View>

      <View className="mt-5 gap-3">
        {EFT_POINTS.map((p) => (
          <EFTPointCard key={p.number} point={p} />
        ))}
      </View>
    </Screen>
  );
}

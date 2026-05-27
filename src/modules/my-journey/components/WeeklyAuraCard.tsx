import weeklyAuraImg from '@/assets/images/four-pillars/pillar-emotion.jpg';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { ImageScrim } from '@/components/ui/ImageScrim';
import { Image } from 'react-native';

// TODO: swap to a real weekly-aura asset when the design ships one.
export function WeeklyAuraCard() {
  return (
    <View className="relative aspect-video overflow-hidden rounded-3xl border border-foreground/10">
      <Image
        source={weeklyAuraImg}
        className="h-full w-full"
        resizeMode="cover"
      />
      <ImageScrim direction="bottom" strength={0.85} start={0.25} />
      <View className="absolute bottom-0 left-0 right-0 p-5">
        <Text
          size="xs"
          treatment="caption"
          weight="bold"
          className="mb-2 text-white/80"
        >
          Weekly Aura
        </Text>
        <Text size="h3" weight="bold" className="text-white">
          Your energy is shifting.
        </Text>
      </View>
    </View>
  );
}

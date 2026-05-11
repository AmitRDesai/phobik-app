import taiChiImg from '@/assets/images/four-pillars/movement-tai-chi.jpg';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { GradientText } from '@/components/ui/GradientText';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { MovementSessionShell } from './MovementSessionShell';

const TIPS = [
  { icon: 'air' as const, text: 'Let your arms float...' },
  {
    icon: 'compare-arrows' as const,
    text: 'Shift your weight to one side...',
  },
  { icon: 'waves' as const, text: 'Move like you’re in water...' },
];

export default function TaiChiSession() {
  return (
    <MovementSessionShell
      wordmark="Tai Chi Wave Hands"
      bottom={
        <View>
          <GradientButton onPress={() => {}}>End Flow</GradientButton>
        </View>
      }
    >
      <View className="items-center pt-2">
        <View className="rounded-full border border-foreground/10 bg-foreground/5 px-4 py-1.5">
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            className="text-foreground/70"
          >
            Active Flow: Tai Chi
          </Text>
        </View>
      </View>

      <View className="mt-6 items-center">
        <Text size="h2" weight="extrabold">
          Move slowly.
        </Text>
        <GradientText className="text-2xl font-extrabold">
          Stay with the flow.
        </GradientText>
      </View>

      {/* Hero with figure */}
      <View className="mt-8 items-center">
        <View
          className="h-[280px] w-[280px] items-center justify-center overflow-hidden rounded-full border border-foreground/10"
          style={{
            boxShadow: `0px 0px 12px ${withAlpha(colors.primary.pink, 0.2)}`,
          }}
        >
          <Image
            source={taiChiImg}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        </View>
      </View>

      {/* Tip cards */}
      <View className="mt-10 gap-3 pb-6">
        {TIPS.map((tip) => (
          <Card
            key={tip.text}
            variant="glass"
            className="flex-row items-center gap-3 p-4"
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-pink/10">
              <MaterialIcons
                name={tip.icon}
                size={18}
                color={colors.primary.pink}
              />
            </View>
            <Text size="lg" className="flex-1 text-foreground/80">
              {tip.text}
            </Text>
          </Card>
        ))}
      </View>
    </MovementSessionShell>
  );
}

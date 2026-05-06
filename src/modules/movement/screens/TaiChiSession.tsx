import taiChiImg from '@/assets/images/four-pillars/movement-tai-chi.jpg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { GradientText } from '@/components/ui/GradientText';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

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
          <Text className="text-[10px] font-bold uppercase tracking-widest text-foreground/70">
            Active Flow: Tai Chi
          </Text>
        </View>
      </View>

      <View className="mt-6 items-center">
        <Text className="text-2xl font-extrabold text-foreground">
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
            shadowColor: colors.primary.pink,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 30,
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
          <View
            key={tip.text}
            className="flex-row items-center gap-3 rounded-3xl border border-foreground/10 bg-foreground/5 p-4"
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-pink/10">
              <MaterialIcons
                name={tip.icon}
                size={18}
                color={colors.primary.pink}
              />
            </View>
            <Text className="flex-1 text-base text-foreground/80">
              {tip.text}
            </Text>
          </View>
        ))}
      </View>
    </MovementSessionShell>
  );
}

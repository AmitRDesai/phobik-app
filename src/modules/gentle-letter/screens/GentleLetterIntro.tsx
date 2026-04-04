import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/ui/BackButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { RadialGlow } from '@/components/ui/RadialGlow';
import { colors } from '@/constants/colors';

export default function GentleLetterIntro() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background-charcoal">
      <GlowBg
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        centerY={0.15}
        radius={0.35}
        intensity={0.5}
        bgClassName="bg-background-charcoal"
      />

      {/* Header */}
      <View
        className="z-10 flex-row items-center justify-between px-4 py-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <BackButton />
        <Text className="text-xs font-bold uppercase tracking-widest text-white/50">
          Practice
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        contentContainerClassName="items-center px-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Glowing Lotus Icon */}
        <View className="relative mb-12 mt-20 items-center justify-center">
          <RadialGlow
            color={colors.primary.pink}
            size={200}
            style={{ top: -60, left: -60 }}
          />
          <View
            className="h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-primary-pink/10"
            style={{
              boxShadow: [
                {
                  offsetX: 0,
                  offsetY: 0,
                  blurRadius: 60,
                  spreadDistance: 10,
                  color: 'rgba(255,182,193,0.2)',
                },
                {
                  offsetX: 0,
                  offsetY: 0,
                  blurRadius: 100,
                  spreadDistance: 20,
                  color: 'rgba(255,255,153,0.1)',
                },
              ],
            }}
          >
            <MaterialIcons
              name="filter-vintage"
              size={56}
              color={colors.primary['pink-light']}
            />
          </View>
        </View>

        {/* Title */}
        <Text className="mb-4 text-center text-[32px] font-bold leading-tight text-white">
          Write a Gentle Letter to Yourself
        </Text>

        {/* Subtitle */}
        <Text className="mb-4 text-center text-lg font-medium text-primary-pink">
          A PHOBIK practice in courage and kindness.
        </Text>

        {/* Body */}
        <Text className="mb-12 max-w-[320px] text-center text-base leading-relaxed text-slate-400">
          A guided exercise in self-compassion. Through 5 gentle steps, replace
          harsh self-judgment with understanding and care.
        </Text>

        {/* Start Button */}
        <View className="w-full">
          <GradientButton
            onPress={() => router.push('/practices/gentle-letter/write')}
          >
            Start My Letter
          </GradientButton>
        </View>

        {/* View Past Letters */}
        <Pressable
          onPress={() => router.push('/practices/gentle-letter/archive')}
          className="mt-4 flex-row items-center gap-2 py-4"
        >
          <MaterialIcons name="history" size={20} color={colors.slate[400]} />
          <Text className="text-base font-medium text-slate-400">
            View Past Letters
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

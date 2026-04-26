import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientText } from '../components/GradientText';
import { PillarCard } from '../components/PillarCard';
import { PILLAR_HUB } from '../data/four-pillars';

export default function FourPillars() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background-dashboard">
      <GlowBg
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        centerY={0.18}
        radius={0.35}
        intensity={0.45}
        bgClassName="bg-background-dashboard"
      />
      <View
        className="flex-row items-center justify-between px-6 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <GradientText className="text-xl font-extrabold tracking-wider">
          FOUR PILLARS
        </GradientText>
      </View>
      <ScrollView
        contentContainerClassName="px-6 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 mt-4">
          <Text className="text-[44px] font-extrabold uppercase leading-none tracking-tighter text-white">
            {PILLAR_HUB.hero.title}
          </Text>
          <GradientText className="text-[44px] font-extrabold uppercase leading-none tracking-tighter">
            {PILLAR_HUB.hero.accent}
          </GradientText>
          <Text className="mt-4 text-base uppercase tracking-[0.2em] text-white/60">
            {PILLAR_HUB.hero.subtitle}
          </Text>
        </View>

        <View className="gap-5">
          {PILLAR_HUB.cards.map((card) => (
            <PillarCard
              key={card.id}
              image={card.image}
              eyebrow={card.eyebrow}
              icon={card.icon}
              accentColor={card.accentColor}
              title={card.title}
              subtitle={card.subtitle}
              onPress={() => router.push(card.route)}
              aspect="tall"
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

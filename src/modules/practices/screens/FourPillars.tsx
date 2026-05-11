import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { Screen } from '@/components/ui/Screen';
import { useRouter } from 'expo-router';

import { PillarCard } from '../components/PillarCard';
import { PILLAR_HUB } from '../data/four-pillars';

export default function FourPillars() {
  const router = useRouter();

  return (
    <Screen
      variant="default"
      scroll
      header={
        <View className="flex-row items-center justify-between px-6 pb-4 pt-2">
          <GradientText className="text-xl font-extrabold tracking-wider">
            FOUR PILLARS
          </GradientText>
        </View>
      }
      className="px-6 pt-4"
      contentClassName="pb-8"
    >
      <View className="mb-8">
        <Text size="display" className="uppercase leading-[1.05]">
          {PILLAR_HUB.hero.title}
        </Text>
        <GradientText className="text-4xl font-extrabold uppercase leading-[1.05]">
          {PILLAR_HUB.hero.accent}
        </GradientText>
        <Text size="md" tone="secondary" className="mt-4 uppercase">
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
    </Screen>
  );
}

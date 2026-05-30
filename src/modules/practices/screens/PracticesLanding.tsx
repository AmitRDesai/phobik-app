import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { Screen } from '@/components/ui/Screen';
import { useRouter } from 'expo-router';

import { PracticeCategoryCard } from '../components/PracticeCategoryCard';
import { PILLAR_HUB } from '../data/four-pillars';

export default function PracticesLanding() {
  const router = useRouter();

  return (
    <Screen scroll className="px-6 pt-4" contentClassName="pb-8">
      <View className="mb-8">
        <GradientText className="text-4xl font-extrabold uppercase leading-[1.05]">
          PRACTICES
        </GradientText>
        <Text size="md" tone="secondary" className="mt-3">
          What type of support do you need?
        </Text>
      </View>

      <View className="gap-5">
        {PILLAR_HUB.cards.map((card) => (
          <PracticeCategoryCard
            key={card.id}
            image={card.image}
            label={card.label}
            tagline={card.tagline}
            practices={card.practices}
            icon={card.icon}
            accentColor={card.accentColor}
            onPress={() => router.push(card.route)}
          />
        ))}
      </View>
    </Screen>
  );
}

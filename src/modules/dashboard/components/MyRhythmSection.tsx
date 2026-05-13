import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import {
  BODY_SUBMENU,
  EMOTION_SUBMENU,
} from '@/modules/practices/data/four-pillars';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { RhythmFlowCard } from './RhythmFlowCard';

const soundStudio = EMOTION_SUBMENU.items.find((i) => i.id === 'sound-studio')!;
const meditation = BODY_SUBMENU.items.find((i) => i.id === 'meditation')!;
const breathe = BODY_SUBMENU.items.find((i) => i.id === 'breathe')!;

const CARDS = [soundStudio, meditation, breathe];
const CARD_WIDTH = 160;
const CARD_GAP = 12;

export function MyRhythmSection() {
  const router = useRouter();

  return (
    <View className="gap-4">
      <View className="flex-row items-baseline justify-between">
        <View className="flex-row items-baseline">
          <Text size="h1">My </Text>
          <GradientText className="text-[28px] font-bold leading-[34px]">
            Rhythm
          </GradientText>
        </View>
        <Text
          size="xs"
          treatment="caption"
          weight="bold"
          tone="secondary"
          className="uppercase tracking-widest"
        >
          Flow States
        </Text>
      </View>

      {/* Horizontal scroll so each card gets a comfortable width on phones —
          a sliver of the next card hints at scrollability. The negative
          margin cancels the Dashboard's body padding so cards can bleed
          to the screen edges, then the inner padding re-applies on the
          scroll content so the first card lines up with surrounding rows. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-4"
        contentContainerClassName="px-4 gap-3"
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_GAP}
      >
        {CARDS.map((card) => (
          <View key={card.id} style={{ width: CARD_WIDTH }}>
            <RhythmFlowCard
              title={card.title}
              image={card.image}
              onPress={() => router.push(card.route!)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

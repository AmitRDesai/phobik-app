import { Text } from '@/components/themed/Text';
import { Pressable, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

type FollowUpSuggestionsProps = {
  suggestions: string[];
  onSelect: (text: string) => void;
  visible: boolean;
};

export function FollowUpSuggestions({
  suggestions,
  onSelect,
  visible,
}: FollowUpSuggestionsProps) {
  if (!visible || suggestions.length === 0) return null;

  return (
    <Animated.View entering={FadeIn.duration(200)} className="-mx-screen-x">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-screen-x py-2"
      >
        {suggestions.map((text) => (
          <Pressable
            key={text}
            onPress={() => onSelect(text)}
            className="rounded-full border border-foreground/10 bg-foreground/[0.04] px-4 py-2"
          >
            <Text variant="sm" muted>
              {text}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

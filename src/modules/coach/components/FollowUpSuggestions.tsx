import { alpha } from '@/constants/colors';
import { Pressable, ScrollView, Text } from 'react-native';
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
    <Animated.View entering={FadeIn.duration(200)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-4 py-2"
      >
        {suggestions.map((text) => (
          <Pressable
            key={text}
            onPress={() => onSelect(text)}
            className="rounded-full border px-4 py-2"
            style={{
              borderColor: alpha.white10,
              backgroundColor: alpha.white05,
            }}
          >
            <Text className="text-[13px] text-white/60">{text}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

import { Button } from '@/components/ui/Button';
import { ScrollView } from 'react-native';
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
          <Button
            key={text}
            variant="secondary"
            size="compact"
            onPress={() => onSelect(text)}
          >
            {text}
          </Button>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

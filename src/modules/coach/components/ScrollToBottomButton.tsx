import { alpha, colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type ScrollToBottomButtonProps = {
  visible: boolean;
  onPress: () => void;
};

export function ScrollToBottomButton({
  visible,
  onPress,
}: ScrollToBottomButtonProps) {
  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(150)}
      className="absolute bottom-2 right-4"
    >
      <Pressable
        onPress={onPress}
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{
          backgroundColor: colors.card.elevated,
          borderWidth: 1,
          borderColor: alpha.white10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }}
      >
        <Ionicons name="chevron-down" size={18} color={alpha.white60} />
      </Pressable>
    </Animated.View>
  );
}

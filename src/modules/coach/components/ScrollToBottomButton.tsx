import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
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
  const scheme = useScheme();
  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(150)}
      className="absolute bottom-2 right-4"
    >
      <Pressable
        onPress={onPress}
        className="h-9 w-9 items-center justify-center rounded-full border border-foreground/10 bg-surface-elevated"
        style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
      >
        <Ionicons
          name="chevron-down"
          size={18}
          color={foregroundFor(scheme, 0.6)}
        />
      </Pressable>
    </Animated.View>
  );
}

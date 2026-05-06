import { BackButton } from '@/components/ui/BackButton';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientText } from '@/components/ui/GradientText';

type PracticeStackHeaderProps = {
  /** Brand wordmark or screen title shown center/right of the back button */
  wordmark?: string;
  onBackPress?: () => void;
  hideBack?: boolean;
};

export function PracticeStackHeader({
  wordmark = 'FOUR PILLARS',
  onBackPress,
  hideBack,
}: PracticeStackHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center justify-between px-6 pb-4"
      style={{ paddingTop: insets.top + 8 }}
    >
      {hideBack ? (
        <View className="h-10 w-10" />
      ) : (
        <BackButton onPress={onBackPress} />
      )}
      <GradientText className="text-base font-extrabold tracking-wider">
        {wordmark}
      </GradientText>
      <View className="h-10 w-10" />
    </View>
  );
}

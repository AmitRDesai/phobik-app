import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
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
  return (
    <View className="flex-row items-center justify-between px-6 pb-4 pt-2">
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

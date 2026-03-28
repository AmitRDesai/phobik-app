import { BlurView } from '@/components/ui/BlurView';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { colors, withAlpha } from '@/constants/colors';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function InsightsHeader() {
  const insets = useSafeAreaInsets();

  const content = (
    <View
      className="flex-row items-center justify-between border-b border-white/5 px-4 pb-4"
      style={{ paddingTop: insets.top + 8 }}
    >
      <View>
        <Text className="text-xl font-black tracking-tight text-white">
          Insights
        </Text>
        <Text className="text-[10px] font-medium uppercase tracking-widest text-primary-pink">
          Biometric Intelligence
        </Text>
      </View>
      <UserAvatar
        className="h-10 w-10 border border-white/20 bg-white/10"
        fallbackColor={colors.primary.muted}
      />
    </View>
  );

  return (
    <BlurView
      intensity={25}
      tint="dark"
      style={{ backgroundColor: withAlpha(colors.background.dashboard, 0.85) }}
    >
      {content}
    </BlurView>
  );
}

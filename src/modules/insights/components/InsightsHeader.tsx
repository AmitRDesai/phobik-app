import { BlurView } from '@/components/ui/BlurView';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useScheme } from '@/hooks/useTheme';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function InsightsHeader() {
  const insets = useSafeAreaInsets();
  const scheme = useScheme();

  return (
    <BlurView
      intensity={25}
      tint={scheme === 'dark' ? 'dark' : 'light'}
      className="bg-surface/85"
    >
      <View
        className="flex-row items-center justify-between border-b border-foreground/5 px-4 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View>
          <Text className="text-xl font-black tracking-tight text-foreground">
            Insights
          </Text>
          <Text className="text-[10px] font-medium uppercase tracking-widest text-primary-pink">
            Biometric Intelligence
          </Text>
        </View>
        <UserAvatar className="h-10 w-10 border border-foreground/20 bg-foreground/10" />
      </View>
    </BlurView>
  );
}

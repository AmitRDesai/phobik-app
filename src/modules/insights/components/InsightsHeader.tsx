import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BlurView } from '@/components/ui/BlurView';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useScheme } from '@/hooks/useTheme';
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
          <Text size="h2" weight="black">
            Insights
          </Text>
          <Text size="xs" treatment="caption" tone="accent">
            Biometric Intelligence
          </Text>
        </View>
        <UserAvatar size="md" className="border border-foreground/20" />
      </View>
    </BlurView>
  );
}

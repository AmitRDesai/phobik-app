import { BackButton } from '@/components/ui/BackButton';
import { BlurView } from '@/components/ui/BlurView';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { variantConfig } from '@/components/variant-config';
import { withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CourageHeader({
  title = 'Courage Practices',
}: {
  title?: string;
}) {
  const insets = useSafeAreaInsets();
  const scheme = useScheme();
  const blurBg = withAlpha(variantConfig.default[scheme].bgHex, 0.7);

  return (
    <BlurView intensity={25} tint={scheme} style={{ backgroundColor: blurBg }}>
      <View className="px-6 pb-4" style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center justify-between">
          <BackButton />
          <Text className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </Text>
          <UserAvatar className="h-10 w-10 border-2 border-primary-pink/30 bg-foreground/10" />
        </View>
      </View>
    </BlurView>
  );
}

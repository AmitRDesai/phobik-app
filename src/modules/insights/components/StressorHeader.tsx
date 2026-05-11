import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { BlurView } from '@/components/ui/BlurView';
import { useScheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StressorHeaderProps {
  title: string;
  subtitle: string;
}

export function StressorHeader({ title, subtitle }: StressorHeaderProps) {
  const insets = useSafeAreaInsets();
  const scheme = useScheme();

  return (
    <BlurView
      intensity={25}
      tint={scheme === 'dark' ? 'dark' : 'light'}
      className="bg-surface/85"
    >
      <View
        className="border-b border-foreground/5 px-4 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center">
          <BackButton className="mr-4" />
          <View>
            <Text size="h2" weight="black" className="uppercase">
              {title}
            </Text>
            <Text size="xs" treatment="caption" tone="accent" className="mt-1">
              {subtitle}
            </Text>
          </View>
        </View>
      </View>
    </BlurView>
  );
}

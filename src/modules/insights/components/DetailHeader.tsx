import { BackButton } from '@/components/ui/BackButton';
import { BlurView } from '@/components/ui/BlurView';
import { useScheme } from '@/hooks/useTheme';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DetailHeaderProps {
  title: string;
  rightAction?: React.ReactNode;
}

export function DetailHeader({ title, rightAction }: DetailHeaderProps) {
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
        <View className="flex-row items-center gap-2">
          <BackButton />
          <Text className="text-lg font-bold tracking-tight text-foreground">
            {title}
          </Text>
        </View>
        {rightAction}
      </View>
    </BlurView>
  );
}

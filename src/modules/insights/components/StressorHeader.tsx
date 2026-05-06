import { BackButton } from '@/components/ui/BackButton';
import { BlurView } from '@/components/ui/BlurView';
import { useScheme } from '@/hooks/useTheme';
import { Text, View } from 'react-native';
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
            <Text className="text-xl font-black uppercase leading-none tracking-tight text-foreground">
              {title}
            </Text>
            <Text className="mt-1 text-[10px] font-bold uppercase tracking-widest text-primary-pink">
              {subtitle}
            </Text>
          </View>
        </View>
      </View>
    </BlurView>
  );
}

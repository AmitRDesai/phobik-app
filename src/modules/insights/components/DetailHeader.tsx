import { BackButton } from '@/components/ui/BackButton';
import { BlurView } from 'expo-blur';
import { Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DetailHeaderProps {
  title: string;
  rightAction?: React.ReactNode;
}

export function DetailHeader({ title, rightAction }: DetailHeaderProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <View
      className="flex-row items-center justify-between border-b border-white/5 px-4 pb-4"
      style={{ paddingTop: insets.top + 8 }}
    >
      <View className="flex-row items-center gap-2">
        <BackButton />
        <Text className="text-lg font-bold tracking-tight text-white">
          {title}
        </Text>
      </View>
      {rightAction}
    </View>
  );

  if (Platform.OS === 'android') {
    return (
      <View style={{ backgroundColor: 'rgba(18, 8, 18, 0.85)' }}>
        {content}
      </View>
    );
  }

  return (
    <BlurView
      intensity={25}
      tint="dark"
      style={{ backgroundColor: 'rgba(18, 8, 18, 0.85)' }}
    >
      {content}
    </BlurView>
  );
}

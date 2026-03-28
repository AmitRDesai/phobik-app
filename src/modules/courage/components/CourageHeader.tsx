import { BackButton } from '@/components/ui/BackButton';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { colors } from '@/constants/colors';
import { BlurView } from 'expo-blur';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CourageHeader({
  title = 'Courage Practices',
}: {
  title?: string;
}) {
  const insets = useSafeAreaInsets();

  return (
    <BlurView
      intensity={25}
      tint="dark"
      style={{ backgroundColor: `${colors.background.charcoal}B3` }}
    >
      <View className="px-6 pb-4" style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center justify-between">
          <BackButton />
          <Text className="text-xl font-bold tracking-tight text-white">
            {title}
          </Text>
          <UserAvatar className="h-10 w-10 border-2 border-primary-pink/30 bg-white/10" />
        </View>
      </View>
    </BlurView>
  );
}

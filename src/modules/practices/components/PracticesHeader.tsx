import { BlurView } from '@/components/ui/BlurView';
import { colors, withAlpha } from '@/constants/colors';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeartRateBadge } from './HeartRateBadge';

export function PracticesHeader() {
  const insets = useSafeAreaInsets();

  return (
    <BlurView
      intensity={25}
      tint="dark"
      style={{ backgroundColor: withAlpha(colors.background.dashboard, 0.7) }}
    >
      <View
        className="border-b border-white/10 px-6 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-pink/80">
              Biometric Syncing
            </Text>
            <Text className="text-3xl font-extrabold tracking-tight text-white">
              Practices
            </Text>
          </View>
          <HeartRateBadge />
        </View>
      </View>
    </BlurView>
  );
}

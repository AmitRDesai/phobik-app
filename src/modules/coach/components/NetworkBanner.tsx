import { Ionicons } from '@expo/vector-icons';
import { useNetInfo } from '@react-native-community/netinfo';
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function NetworkBanner() {
  const { isConnected } = useNetInfo();

  if (isConnected !== false) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
    >
      <View className="mx-4 mb-2 flex-row items-center gap-2 rounded-2xl bg-amber-500/10 px-4 py-2.5">
        <Ionicons name="cloud-offline-outline" size={16} color="#f59e0b" />
        <Text className="flex-1 text-[13px] text-amber-400">
          You&apos;re offline. Messages will be sent when you reconnect.
        </Text>
      </View>
    </Animated.View>
  );
}

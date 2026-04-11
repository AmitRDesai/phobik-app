import { Ionicons } from '@expo/vector-icons';
import { useNetInfo } from '@react-native-community/netinfo';
import { Text, View } from 'react-native';
import { EaseView } from 'react-native-ease';

export function NetworkBanner() {
  const { isConnected } = useNetInfo();
  const isOffline = isConnected === false;

  if (!isOffline) return null;

  return (
    <EaseView
      animate={{ opacity: isOffline ? 1 : 0 }}
      transition={{ type: 'timing', duration: 200 }}
      pointerEvents={isOffline ? 'auto' : 'none'}
    >
      <View className="mx-4 mb-2 flex-row items-center gap-2 rounded-2xl bg-amber-500/10 px-4 py-2.5">
        <Ionicons name="cloud-offline-outline" size={16} color="#f59e0b" />
        <Text className="flex-1 text-[13px] text-amber-400">
          You&apos;re offline. Posts will load when you reconnect.
        </Text>
      </View>
    </EaseView>
  );
}

import { colors, withAlpha } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNetInfo } from '@react-native-community/netinfo';
import { Text, View } from 'react-native';
import { EaseView } from 'react-native-ease';

interface NetworkBannerProps {
  message: string;
}

export function NetworkBanner({ message }: NetworkBannerProps) {
  const { isConnected } = useNetInfo();
  const isOffline = isConnected === false;

  if (!isOffline) return null;

  return (
    <EaseView
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 200 }}
      pointerEvents="auto"
    >
      <View
        className="mx-4 mb-2 flex-row items-center gap-2 rounded-2xl px-4 py-2.5"
        style={{ backgroundColor: withAlpha(colors.status.warning, 0.1) }}
      >
        <Ionicons
          name="cloud-offline-outline"
          size={16}
          color={colors.status.warning}
        />
        <Text
          className="flex-1 text-[13px]"
          style={{ color: colors.status.warning }}
        >
          {message}
        </Text>
      </View>
    </EaseView>
  );
}

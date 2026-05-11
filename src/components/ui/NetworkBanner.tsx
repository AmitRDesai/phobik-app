import { Text } from '@/components/themed/Text';
import { colors, withAlpha } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNetInfo } from '@react-native-community/netinfo';
import { clsx } from 'clsx';
import { View } from 'react-native';
import { EaseView } from 'react-native-ease';

interface NetworkBannerProps {
  message: string;
  /**
   * Outer container className. Default: `mx-4 mb-2`. Pass `""` to opt out
   * of the default margin when the parent owns spacing.
   */
  className?: string;
}

export function NetworkBanner({
  message,
  className = 'mx-4 mb-2',
}: NetworkBannerProps) {
  const { isConnected, isInternetReachable } = useNetInfo();
  // Hide when both signals are positive (or still resolving). A device on
  // Wi-Fi with no working internet (captive portal, hotel network) returns
  // `isConnected: true` + `isInternetReachable: false` — surface those too.
  const isOffline = isConnected === false || isInternetReachable === false;

  if (!isOffline) return null;

  return (
    <EaseView
      initialAnimate={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 200 }}
      pointerEvents="auto"
    >
      <View
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        className={clsx(
          'flex-row items-center gap-2 rounded-2xl px-4 py-2.5',
          className,
        )}
        style={{ backgroundColor: withAlpha(colors.status.warning, 0.1) }}
      >
        <Ionicons
          name="cloud-offline-outline"
          size={16}
          color={colors.status.warning}
        />
        <Text
          size="sm"
          className="flex-1"
          style={{ color: colors.status.warning }}
        >
          {message}
        </Text>
      </View>
    </EaseView>
  );
}

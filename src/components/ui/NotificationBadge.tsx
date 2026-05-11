import { Text } from '@/components/themed/Text';
import { View } from 'react-native';

interface NotificationBadgeProps {
  count: number;
}

/**
 * Small unread badge to overlay on top of an icon button.
 * Hides automatically when count is 0. Shows "9+" when count > 9.
 * Parent must have `relative` positioning for this to anchor correctly.
 */
export function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count <= 0) return null;

  const display = count > 9 ? '9+' : String(count);

  return (
    <View
      className="absolute -right-1 -top-1 h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-background-dashboard bg-primary-pink px-1"
      pointerEvents="none"
    >
      <Text tone="inverse" weight="bold" className="text-[10px] leading-none">
        {display}
      </Text>
    </View>
  );
}

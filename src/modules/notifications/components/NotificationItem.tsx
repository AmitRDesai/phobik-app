import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { NotificationItem as NotificationItemType } from '../hooks/useNotifications';

interface NotificationItemProps {
  notification: NotificationItemType;
}

const TYPE_CONFIG: Record<
  NotificationItemType['type'],
  { icon: keyof typeof MaterialIcons.glyphMap; color: string }
> = {
  system: { icon: 'info', color: colors.accent.info },
  reminder: { icon: 'alarm', color: colors.accent.yellow },
  challenge: { icon: 'emoji-events', color: colors.accent.gold },
  community: { icon: 'groups', color: colors.accent.purple },
  coach: { icon: 'psychology', color: colors.primary.pink },
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter();
  const scheme = useScheme();
  const { icon, color } = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.system;
  const isUnread = notification.readAt === null;

  const handlePress = () => {
    const screen = notification.data?.screen;
    if (screen) {
      // @ts-expect-error — screen is dynamic, route may be typed
      router.push({ pathname: screen, params: notification.data?.params });
    }
  };

  return (
    <Card
      onPress={handlePress}
      className="flex-row items-start gap-3 px-4 py-3.5"
    >
      <IconChip size="md" shape="rounded" bg={withAlpha(color, 0.13)}>
        <MaterialIcons name={icon} size={20} color={color} />
      </IconChip>

      <View className="flex-1 gap-0.5">
        <View className="flex-row items-center gap-2">
          <Text
            size="sm"
            weight="semibold"
            className="flex-1"
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          {isUnread && (
            <View className="h-2 w-2 rounded-full bg-primary-pink" />
          )}
        </View>
        <Text size="sm" tone="secondary" numberOfLines={2}>
          {notification.body}
        </Text>
        <Text size="xs" tone="tertiary" className="mt-1">
          {formatTimestamp(notification.createdAt)}
        </Text>
      </View>

      {notification.data?.screen && (
        <MaterialIcons
          name="chevron-right"
          size={18}
          color={foregroundFor(scheme, 0.3)}
          style={{ marginTop: 12 }}
        />
      )}
    </Card>
  );
}

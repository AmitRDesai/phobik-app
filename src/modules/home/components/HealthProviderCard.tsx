import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

export type HealthProviderCardProps = {
  icon: MaterialIconName;
  name: string;
  /** Short status/description line under the name (e.g. "Connected", "Syncing…"). */
  subtitle: string;
  connected: boolean;
  /** Primary action shown when NOT connected ("Connect", "Reconnect", "Install"). */
  actionLabel: string;
  onAction: () => void;
  /** Secondary action shown when connected ("Disconnect", "Settings"). */
  secondaryActionLabel?: string;
  onSecondary?: () => void;
  busy?: boolean;
  disabled?: boolean;
};

/**
 * One connectable health source in the multi-provider list — matches the
 * `design/home/sync_devices` card: icon + (name over a caption) on the left, a
 * pill action on the right. Renders the same for on-device (Apple Health /
 * Health Connect) and cloud (WHOOP) sources; the caller wires the kind-specific
 * connect/disconnect actions and a short status line.
 */
export function HealthProviderCard({
  icon,
  name,
  subtitle,
  connected,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondary,
  busy,
  disabled,
}: HealthProviderCardProps) {
  return (
    <Card className="p-4">
      <View className="flex-row items-center gap-3">
        <IconChip size="md" shape="rounded" tone={connected ? 'cyan' : 'pink'}>
          {(color) => <MaterialIcons name={icon} size={22} color={color} />}
        </IconChip>

        {/* flex-1 bounds the column so both lines truncate and stay clear of
            the action button on the right. */}
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text
              size="md"
              weight="semibold"
              numberOfLines={1}
              style={{ flexShrink: 1 }}
            >
              {name}
            </Text>
            {connected ? (
              <Badge
                tone="cyan"
                icon={(c) => <MaterialIcons name="check" size={12} color={c} />}
              />
            ) : null}
          </View>
          <Text size="sm" tone="secondary" numberOfLines={1} className="mt-0.5">
            {subtitle}
          </Text>
        </View>

        {connected ? (
          secondaryActionLabel && onSecondary ? (
            <Button variant="ghost" size="sm" onPress={onSecondary}>
              {secondaryActionLabel}
            </Button>
          ) : null
        ) : (
          <Button
            variant="primary"
            size="sm"
            onPress={onAction}
            loading={busy}
            disabled={disabled}
          >
            {actionLabel}
          </Button>
        )}
      </View>
    </Card>
  );
}

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import type { AccentHue } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

export type HealthProviderCardProps = {
  icon: MaterialIconName;
  name: string;
  subtitle: string;
  connected: boolean;
  /** Small status badge shown next to the name (e.g. "Connected", "Syncing"). */
  statusLabel?: string;
  statusTone?: AccentHue;
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
 * One connectable health source in the multi-provider list. Renders the same
 * for on-device (Apple Health / Health Connect) and cloud (WHOOP) sources —
 * the caller wires the kind-specific connect/disconnect actions.
 */
export function HealthProviderCard({
  icon,
  name,
  subtitle,
  connected,
  statusLabel,
  statusTone = 'cyan',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondary,
  busy,
  disabled,
}: HealthProviderCardProps) {
  return (
    <Card className="p-4">
      <View className="flex-row items-center gap-4">
        <IconChip size="md" shape="rounded" tone={connected ? 'cyan' : 'pink'}>
          {(color) => <MaterialIcons name={icon} size={22} color={color} />}
        </IconChip>

        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text size="md" weight="semibold">
              {name}
            </Text>
            {statusLabel ? (
              <Badge size="sm" tone={statusTone}>
                {statusLabel}
              </Badge>
            ) : null}
          </View>
          <Text size="sm" tone="secondary" className="mt-0.5">
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

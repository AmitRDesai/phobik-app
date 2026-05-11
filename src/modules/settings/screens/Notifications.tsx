import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { Switch } from '@/components/ui/Switch';
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from '../hooks/useNotificationSettings';

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function ToggleRow({
  label,
  description,
  value,
  onValueChange,
}: ToggleRowProps) {
  return (
    <Card className="flex-row items-center gap-3 px-4 py-3.5">
      <View className="flex-1">
        <Text size="md" weight="semibold">
          {label}
        </Text>
        <Text size="sm" tone="secondary">
          {description}
        </Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </Card>
  );
}

export default function Notifications() {
  const { data: settings } = useNotificationSettings();
  const updateSettings = useUpdateNotificationSettings();

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="Notifications" />}
      className="px-4"
      contentClassName="gap-2"
    >
      <ToggleRow
        label="Daily Reminders"
        description="Get a daily reminder to check in with your practice"
        value={settings.dailyReminders}
        onValueChange={(value) =>
          updateSettings.mutate({ dailyReminders: value })
        }
      />
      <ToggleRow
        label="Check-in Reminders"
        description="Reminders before your scheduled check-ins"
        value={settings.checkInReminders}
        onValueChange={(value) =>
          updateSettings.mutate({ checkInReminders: value })
        }
      />
      <ToggleRow
        label="Challenge Notifications"
        description="Updates about your active challenges"
        value={settings.challengeNotifications}
        onValueChange={(value) =>
          updateSettings.mutate({ challengeNotifications: value })
        }
      />
    </Screen>
  );
}

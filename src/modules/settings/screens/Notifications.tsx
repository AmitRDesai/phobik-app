import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Switch, Text, View } from 'react-native';
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
  const scheme = useScheme();
  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/5 px-4 py-3.5">
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">{label}</Text>
        <Text className="text-sm text-foreground/50">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: foregroundFor(scheme, 0.1),
          true: colors.primary.pink,
        }}
        thumbColor="white"
      />
    </View>
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

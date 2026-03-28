import { GlowBg } from '@/components/ui/GlowBg';
import { alpha, colors } from '@/constants/colors';
import { BackButton } from '@/components/ui/BackButton';
import { useAtom } from 'jotai';
import { ScrollView, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  challengeNotificationsAtom,
  checkInRemindersAtom,
  dailyRemindersAtom,
} from '../store/notifications';

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
    <View className="flex-row items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5">
      <View className="flex-1">
        <Text className="text-base font-semibold text-white">{label}</Text>
        <Text className="text-sm text-white/50">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: alpha.white10,
          true: colors.primary.pink,
        }}
        thumbColor="white"
      />
    </View>
  );
}

export default function Notifications() {
  const insets = useSafeAreaInsets();
  const [dailyReminders, setDailyReminders] = useAtom(dailyRemindersAtom);
  const [checkInReminders, setCheckInReminders] = useAtom(checkInRemindersAtom);
  const [challengeNotifications, setChallengeNotifications] = useAtom(
    challengeNotificationsAtom,
  );

  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-dashboard"
        centerY={0.15}
        intensity={0.5}
      />

      {/* Header */}
      <View
        className="flex-row items-center gap-3 px-4 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <BackButton />
        <Text className="text-lg font-bold text-white">Notifications</Text>
      </View>

      <ScrollView contentContainerClassName="gap-2 px-4 py-4 pb-8">
        <ToggleRow
          label="Daily Reminders"
          description="Get a daily reminder to check in with your practice"
          value={dailyReminders}
          onValueChange={setDailyReminders}
        />
        <ToggleRow
          label="Check-in Reminders"
          description="Reminders before your scheduled check-ins"
          value={checkInReminders}
          onValueChange={setCheckInReminders}
        />
        <ToggleRow
          label="Challenge Notifications"
          description="Updates about your active challenges"
          value={challengeNotifications}
          onValueChange={setChallengeNotifications}
        />

        <View className="h-4" />
      </ScrollView>
    </View>
  );
}

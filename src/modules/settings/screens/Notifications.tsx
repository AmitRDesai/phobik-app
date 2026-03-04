import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
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
          false: 'rgba(255,255,255,0.1)',
          true: colors.primary.pink,
        }}
        thumbColor="white"
      />
    </View>
  );
}

export default function Notifications() {
  const router = useRouter();
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
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5"
        >
          <MaterialIcons name="arrow-back" size={22} color="white" />
        </Pressable>
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

import { GlowBg } from '@/components/ui/GlowBg';
import { CalendarSettings } from '@/modules/calendar/components/CalendarSettings';
import { BackButton } from '@/components/ui/BackButton';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Calendar() {
  const insets = useSafeAreaInsets();

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
        <Text className="text-lg font-bold text-white">Calendar</Text>
      </View>

      <ScrollView contentContainerClassName="px-4 py-4 pb-8">
        <CalendarSettings />
        <View className="h-4" />
      </ScrollView>
    </View>
  );
}

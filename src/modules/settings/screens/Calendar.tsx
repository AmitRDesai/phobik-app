import { BackButton } from '@/components/ui/BackButton';
import { Screen } from '@/components/ui/Screen';
import { CalendarSettings } from '@/modules/calendar/components/CalendarSettings';
import { Text, View } from 'react-native';

export default function Calendar() {
  return (
    <Screen
      variant="default"
      scroll
      header={
        <View className="flex-row items-center gap-3 px-4 py-2">
          <BackButton />
          <Text className="text-lg font-bold text-foreground">Calendar</Text>
        </View>
      }
      className="px-4"
    >
      <CalendarSettings />
    </Screen>
  );
}

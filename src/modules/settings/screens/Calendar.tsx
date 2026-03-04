import { GlowBg } from '@/components/ui/GlowBg';
import { CalendarSettings } from '@/modules/calendar/components/CalendarSettings';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Calendar() {
  const router = useRouter();
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
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5"
        >
          <MaterialIcons name="arrow-back" size={22} color="white" />
        </Pressable>
        <Text className="text-lg font-bold text-white">Calendar</Text>
      </View>

      <ScrollView contentContainerClassName="px-4 py-4 pb-8">
        <CalendarSettings />
        <View className="h-4" />
      </ScrollView>
    </View>
  );
}

import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ExerciseLibraryHeader() {
  const insets = useSafeAreaInsets();

  return (
    <BlurView
      intensity={25}
      tint="dark"
      style={{ backgroundColor: 'rgba(18, 8, 18, 0.7)' }}
    >
      <View
        className="border-b border-white/5 px-6 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => router.back()}
              className="active:opacity-70"
            >
              <MaterialIcons name="chevron-left" size={28} color="white" />
            </Pressable>
            <Text className="text-2xl font-bold tracking-tight text-white">
              Exercise Library
            </Text>
          </View>
          <Pressable className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 active:opacity-70">
            <MaterialIcons name="tune" size={20} color={colors.accent.yellow} />
          </Pressable>
        </View>
      </View>
    </BlurView>
  );
}

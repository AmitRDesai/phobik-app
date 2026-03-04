import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

export function SleepScoreHeader() {
  return (
    <View className="items-center py-8 px-4">
      {/* Glowing crescent moon */}
      <View className="relative mb-6 h-40 w-40 items-center justify-center">
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 160,
            height: 160,
            borderRadius: 80,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.primary.pink,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 25,
            elevation: 8,
          }}
        >
          {/* Dark circle for crescent effect */}
          <View
            className="absolute rounded-full bg-background-dashboard"
            style={{
              width: 144,
              height: 144,
              transform: [{ translateX: 16 }, { translateY: -8 }],
            }}
          />
          <View className="z-10 items-center">
            <Text className="text-5xl font-extrabold text-white">84</Text>
            <Text className="text-[10px] font-bold uppercase tracking-widest text-white/80">
              Score
            </Text>
          </View>
        </LinearGradient>
      </View>
      <Text className="text-2xl font-bold text-white">Restorative Sleep</Text>
      <Text className="mt-1 font-medium text-primary-pink/80">
        Your body recovered efficiently last night
      </Text>
    </View>
  );
}

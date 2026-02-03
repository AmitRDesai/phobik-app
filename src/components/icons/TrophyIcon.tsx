import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import { colors } from '@/constants/colors';

export function TrophyIcon() {
  return (
    <View className="relative aspect-square w-full max-w-[300px] items-center justify-center">
      {/* Radial glow background */}
      <View
        className="absolute inset-0 scale-150 rounded-full"
        style={{
          backgroundColor: 'rgba(255, 45, 133, 0.12)',
          shadowColor: colors.primary.pink,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.35,
          shadowRadius: 80,
        }}
      />

      {/* Light beams */}
      <View
        className="absolute h-64 w-1 rotate-45"
        style={{
          backgroundColor: 'rgba(255, 215, 0, 0.15)',
        }}
      />
      <View
        className="absolute h-64 w-1 -rotate-45"
        style={{
          backgroundColor: 'rgba(255, 215, 0, 0.15)',
        }}
      />
      <View
        className="absolute h-64 w-1 rotate-90"
        style={{
          backgroundColor: 'rgba(255, 215, 0, 0.15)',
        }}
      />

      {/* Trophy circle container */}
      <LinearGradient
        colors={[`${colors.primary.pink}33`, `${colors.accent.yellow}33`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: 192,
          height: 192,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 9999,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          shadowColor: colors.primary.pink,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 60,
        }}
      >
        <View className="items-center">
          <MaterialCommunityIcons
            name="trophy"
            size={112}
            color="white"
            style={{
              shadowColor: colors.accent.yellow,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 20,
            }}
          />

          {/* Decorative dots */}
          <View className="mt-4 flex-row gap-1.5">
            <View
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: colors.primary.pink,
                shadowColor: colors.primary.pink,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 8,
              }}
            />
            <View
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: colors.accent.yellow,
                shadowColor: colors.accent.yellow,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 8,
              }}
            />
            <View
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: colors.primary.pink,
                shadowColor: colors.primary.pink,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 8,
              }}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Floating sparkles */}
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        style={{
          position: 'absolute',
          right: 16,
          top: 0,
          width: 24,
          height: 24,
          borderRadius: 9999,
          opacity: 0.8,
          shadowRadius: 2,
          shadowOpacity: 0.8,
        }}
      />
      <LinearGradient
        colors={[colors.accent.yellow, colors.primary.pink]}
        style={{
          position: 'absolute',
          bottom: 32,
          left: 16,
          width: 16,
          height: 16,
          borderRadius: 9999,
          opacity: 0.8,
          shadowRadius: 1,
          shadowOpacity: 0.8,
        }}
      />
      <View
        className="absolute left-0 top-1/4 h-2 w-2 rounded-full opacity-60"
        style={{ backgroundColor: colors.accent.yellow }}
      />
    </View>
  );
}

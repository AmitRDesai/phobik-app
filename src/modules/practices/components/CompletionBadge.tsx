import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

export function CompletionBadge() {
  return (
    <View className="items-center justify-center">
      {/* Blur glow behind */}
      <View className="absolute h-36 w-36 rounded-full bg-primary-pink/20 blur-3xl" />

      <View className="items-center justify-center">
        {/* Dashed orbit ring */}
        <View
          className="absolute rounded-full border-2 border-dashed border-white/20"
          style={{ width: 180, height: 180 }}
        />

        {/* Outer ring */}
        <View className="h-36 w-36 items-center justify-center rounded-full border-[10px] border-primary-pink/20">
          {/* Middle ring */}
          <View className="h-28 w-28 items-center justify-center rounded-full border-[6px] border-primary-pink/40">
            {/* Inner gradient circle with checkmark */}
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons name="check-circle" size={36} color="white" />
            </LinearGradient>
          </View>
        </View>
      </View>
    </View>
  );
}

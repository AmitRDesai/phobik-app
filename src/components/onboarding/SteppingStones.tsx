import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import { colors } from '@/constants/colors';

export function SteppingStones() {
  const stones = [
    {
      width: 32,
      height: 16,
      top: 32,
      left: '50%',
      translateX: -16,
      opacity: 0.3,
    },
    {
      width: 48,
      height: 24,
      top: 64,
      left: '50%',
      translateX: -48,
      opacity: 0.5,
    },
    {
      width: 64,
      height: 32,
      top: 112,
      left: '50%',
      translateX: 16,
      opacity: 0.7,
    },
    {
      width: 80,
      height: 40,
      top: 176,
      left: '50%',
      translateX: -64,
      opacity: 0.85,
    },
    {
      width: 112,
      height: 56,
      top: 256,
      left: '50%',
      translateX: -56,
      opacity: 1,
    },
  ];

  return (
    <View className="relative h-[320px] w-full max-w-[320px] items-center">
      {/* Starting glow */}
      <View
        className="absolute top-0 h-4 w-4 rounded-full"
        style={{
          backgroundColor: colors.accent.yellow,
          shadowColor: colors.accent.yellow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
          left: '50%',
          marginLeft: -8,
        }}
      />

      {/* Stepping stones */}
      {stones.map((stone, index) => (
        <View
          key={index}
          className="absolute rounded-lg"
          style={{
            width: stone.width,
            height: stone.height,
            top: stone.top,
            left: stone.left,
            marginLeft: stone.translateX,
            opacity: stone.opacity,
            transform: [{ perspective: 500 }, { rotateX: '45deg' }],
          }}
        >
          <LinearGradient
            colors={[
              colors.primary['pink-light'],
              colors.accent['yellow-light'],
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 8,
              shadowColor: colors.primary.pink,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: index === stones.length - 1 ? 0.6 : 0.4,
              shadowRadius: index === stones.length - 1 ? 25 : 15,
            }}
          />
        </View>
      ))}

      {/* Decorative sparkles */}
      <View
        className="absolute h-1 w-1 rounded-full bg-white opacity-40"
        style={{
          top: 80,
          left: '33%',
          shadowColor: '#fff',
          shadowRadius: 1,
          shadowOpacity: 0.4,
        }}
      />
      <View
        className="absolute h-1.5 w-1.5 rounded-full opacity-60"
        style={{
          top: 160,
          right: '25%',
          backgroundColor: colors.accent.yellow,
          shadowColor: colors.accent.yellow,
          shadowRadius: 2,
          shadowOpacity: 0.6,
        }}
      />
      <View
        className="absolute h-1 w-1 rounded-full opacity-40"
        style={{
          top: 240,
          left: '25%',
          backgroundColor: colors.primary.pink,
          shadowColor: colors.primary.pink,
          shadowRadius: 1,
          shadowOpacity: 0.4,
        }}
      />
    </View>
  );
}

import { colors } from '@/constants/colors';
import { BlurView } from 'expo-blur';
import { View, Text } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient as SvgLinearGradient,
  Stop,
  Circle,
  Mask,
  Rect,
} from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

export function ChakraFigure() {
  const chakraColors = [
    colors.chakra.violet, // Crown
    colors.chakra.indigo, // Third eye
    colors.chakra.blue, // Throat
    colors.chakra.green, // Heart
    colors.chakra.yellow, // Solar plexus
    colors.chakra.orange, // Sacral
    colors.chakra.red, // Root
  ];

  return (
    <View
      className="relative w-full max-w-[320px] items-center"
      style={{ overflow: 'visible' }}
    >
      {/* Meditation glow background */}
      <Svg
        width={560}
        height={560}
        style={{ position: 'absolute', top: -140, left: -120 }}
      >
        <Defs>
          <RadialGradient id="radialMask" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="white" stopOpacity={1} />
            <Stop offset="40%" stopColor="white" stopOpacity={0.6} />
            <Stop offset="70%" stopColor="white" stopOpacity={0.2} />
            <Stop offset="100%" stopColor="white" stopOpacity={0} />
          </RadialGradient>
          <SvgLinearGradient id="angularColor" x1="0" y1="0" x2="1" y2="1">
            <Stop
              offset="0%"
              stopColor={colors.chakra.orange}
              stopOpacity={0.45}
            />
            <Stop
              offset="100%"
              stopColor={colors.primary.pink}
              stopOpacity={0.25}
            />
          </SvgLinearGradient>
          <Mask id="fadeMask">
            <Rect width={560} height={560} fill="black" />
            <Circle cx={280} cy={280} r={280} fill="url(#radialMask)" />
          </Mask>
        </Defs>
        <Circle
          cx={280}
          cy={280}
          r={280}
          fill="url(#angularColor)"
          mask="url(#fadeMask)"
        />
      </Svg>

      {/* Human figure */}
      <View className="relative items-center opacity-90">
        {/* Head */}
        <View className="mb-2 h-14 w-14 rounded-full border border-white/10 bg-white/5" />

        {/* Body and legs container */}
        <View className="relative h-40 w-48">
          {/* Torso */}
          <View className="absolute left-1/2 top-0 h-32 w-20 -translate-x-1/2 rounded-t-[40px] border-x border-t border-white/10 bg-white/5" />

          {/* Left leg */}
          <View
            className="absolute bottom-0 left-0 h-16 w-28 rotate-[-15deg] rounded-full border border-white/5 bg-white/5"
            style={{ transform: [{ rotate: '-15deg' }] }}
          />

          {/* Right leg */}
          <View
            className="absolute bottom-0 right-0 h-16 w-28 rotate-[15deg] rounded-full border border-white/5 bg-white/5"
            style={{ transform: [{ rotate: '15deg' }] }}
          />

          {/* Chakra orbs */}
          <View className="absolute inset-0 z-10 items-center justify-between py-2">
            {chakraColors.map((color, index) => (
              <View
                key={index}
                className="rounded-full"
                style={{
                  width: index === 0 || index === 6 ? 10 : 8,
                  height: index === 0 || index === 6 ? 10 : 8,
                  backgroundColor: color,
                  marginTop: index === 0 ? -48 : 4,
                  shadowColor: color,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 12,
                }}
              />
            ))}
          </View>
        </View>
      </View>

      {/* SIGHT badge */}
      <BlurView
        intensity={40}
        tint="dark"
        className="absolute -left-6 top-4 flex-row items-center gap-2 rounded-2xl border border-white/10 px-3.5 py-2 shadow-lg"
        style={{
          backgroundColor: 'rgba(255, 45, 133, 0.15)',
        }}
      >
        <Ionicons name="eye" size={14} color="#FFD700" />
        <Text className="text-[10px] font-bold uppercase tracking-wider text-white">
          Sight
        </Text>
      </BlurView>

      {/* SOUND badge */}
      <BlurView
        intensity={40}
        tint="dark"
        className="absolute -right-6 bottom-12 flex-row items-center gap-2 rounded-2xl border border-white/10 px-3.5 py-2 shadow-lg"
        style={{
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
        }}
      >
        <Ionicons name="volume-medium" size={14} color="#FF2D85" />
        <Text className="text-[10px] font-bold uppercase tracking-wider text-white">
          Sound
        </Text>
      </BlurView>
    </View>
  );
}

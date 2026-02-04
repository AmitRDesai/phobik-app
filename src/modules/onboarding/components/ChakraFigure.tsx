import { BlurView } from 'expo-blur';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ChakraFigure() {
  const chakraColors = [
    '#FFD700', // Crown - yellow
    '#FFE66D', // Third eye
    '#FFDB99', // Throat
    '#FF9BB4', // Heart
    '#FF79B0', // Solar plexus
    '#FF2D85', // Sacral - pink
    '#D11A66', // Root - deep pink
  ];

  return (
    <View className="relative w-full max-w-[320px] items-center">
      {/* Meditation glow background */}
      <View
        className="absolute h-80 w-80 rounded-full"
        style={{
          backgroundColor: 'rgba(255, 45, 133, 0.1)',
          shadowColor: '#FF2D85',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 80,
        }}
      />

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

import { colors } from '@/constants/colors';
import { StyleSheet, View } from 'react-native';

interface NebulaBgProps {
  intensity?: number;
  centerY?: number;
}

export function NebulaBg({ intensity = 1, centerY = 0.5 }: NebulaBgProps) {
  const centerYPercent = `${centerY * 100}%`;

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: colors.background.dark },
      ]}
    >
      {/* Pink glow - subtle radial effect */}
      <View
        style={{
          position: 'absolute',
          width: 320,
          height: 320,
          borderRadius: 160,
          backgroundColor: colors.primary.pink,
          opacity: intensity * 0.1,
          left: '50%',
          top: centerYPercent,
          marginLeft: -160,
          marginTop: -160,
          shadowColor: colors.primary.pink,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: intensity * 0.08,
          shadowRadius: 70,
        }}
      />

      {/* Yellow glow - even more subtle */}
      <View
        style={{
          position: 'absolute',
          width: 224,
          height: 224,
          borderRadius: 112,
          backgroundColor: colors.accent.yellow,
          opacity: intensity * 0.05,
          left: '50%',
          top: centerYPercent,
          marginLeft: -112,
          marginTop: -112,
          shadowColor: colors.accent.yellow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: intensity * 0.03,
          shadowRadius: 50,
        }}
      />
    </View>
  );
}

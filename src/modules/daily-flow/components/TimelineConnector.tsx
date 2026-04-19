import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

export function TimelineConnector() {
  return (
    <View
      className="absolute bottom-0 left-[23px] top-0 w-0.5 opacity-[0.35]"
      pointerEvents="none"
    >
      <LinearGradient
        colors={[
          colors.primary.pink,
          colors.accent.yellow,
          colors.accent.purple,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      />
    </View>
  );
}

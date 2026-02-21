import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

const FADE_HEIGHT = 64;

interface ScrollFadeProps {
  children: React.ReactNode;
  fadeColor?: string;
}

export function ScrollFade({ children, fadeColor }: ScrollFadeProps) {
  return (
    <View className="relative flex-1">
      {children}
      <LinearGradient
        colors={['transparent', fadeColor ?? colors.background.dark]}
        style={styles.fade}
        pointerEvents="none"
      />
    </View>
  );
}

export { FADE_HEIGHT };

const styles = StyleSheet.create({
  fade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: FADE_HEIGHT,
  },
});

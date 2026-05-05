import { colors, withAlpha } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

const FADE_HEIGHT = 64;

interface ScrollFadeProps {
  children: React.ReactNode;
  fadeColor?: string;
}

export function ScrollFade({ children, fadeColor }: ScrollFadeProps) {
  // Start with the bg color at 0 opacity (not 'transparent') so the
  // gradient interpolation doesn't pass through middle gray. The
  // "transparent" keyword is rgba(0,0,0,0), which interpolates RGB
  // toward black mid-gradient — visible as a dark band on light bgs.
  const end = fadeColor ?? colors.background.dark;
  return (
    <View className="relative flex-1">
      {children}
      <LinearGradient
        colors={[withAlpha(end, 0), end]}
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

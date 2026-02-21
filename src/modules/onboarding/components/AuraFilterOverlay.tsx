import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

export function AuraFilterOverlay() {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="auraOverlay" cx="50%" cy="50%" r="50%">
            <Stop offset="30%" stopColor="transparent" stopOpacity={0} />
            <Stop offset="70%" stopColor="#f4258c" stopOpacity={0.3} />
            <Stop offset="100%" stopColor="#facc15" stopOpacity={0.2} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#auraOverlay)" />
      </Svg>
    </Animated.View>
  );
}

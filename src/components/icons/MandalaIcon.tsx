import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  RadialGradient,
  Stop,
} from 'react-native-svg';

interface MandalaIconProps {
  size?: number;
  animated?: boolean;
}

export function MandalaIcon({ size = 256, animated = true }: MandalaIconProps) {
  const pulseOpacity = useSharedValue(0.01);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (animated) {
      pulseOpacity.value = withRepeat(
        withTiming(0.2, { duration: 2000 }),
        -1,
        true,
      );
      pulseScale.value = withRepeat(
        withTiming(1.1, { duration: 2000 }),
        -1,
        true,
      );
    }
  }, [animated, pulseOpacity, pulseScale]);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Glow backgrounds */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size * 0.5,
            height: size * 0.5,
            backgroundColor: '#FF2D85',
            borderRadius: size * 0.25,
            opacity: 0.15,
            shadowColor: '#FF2D85',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 30,
          },
          animatedGlowStyle,
        ]}
      />

      {/* SVG Mandala */}
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          <RadialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <Stop offset="40%" stopColor="#FF2D85" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <G transform="translate(100, 100)">
          {/* Center circle */}
          <Circle
            cx="0"
            cy="0"
            r="18"
            stroke="white"
            strokeWidth="0.5"
            fill="none"
            opacity="0.6"
          />

          {/* Rotating circles */}
          <G>
            {Array.from({ length: 12 }).map((_, i) => (
              <Circle
                key={`circle-${i}`}
                cx="0"
                cy="-22"
                r="22"
                stroke="white"
                strokeWidth="0.3"
                fill="none"
                opacity="0.4"
                transform={`rotate(${i * 30})`}
              />
            ))}
          </G>

          {/* Ellipses */}
          <G>
            {Array.from({ length: 16 }).map((_, i) => (
              <Ellipse
                key={`ellipse-${i}`}
                cx="0"
                cy="-35"
                rx="20"
                ry="50"
                stroke="white"
                strokeWidth="0.4"
                fill="none"
                opacity="0.7"
                transform={`rotate(${i * 22.5})`}
              />
            ))}
          </G>

          {/* Outer dashed circle */}
          <Circle
            cx="0"
            cy="0"
            r="75"
            stroke="white"
            strokeWidth="0.2"
            strokeDasharray="2 4"
            fill="none"
            opacity="0.3"
          />

          {/* Center glowing circle */}
          <Circle cx="0" cy="0" r="12" fill="url(#centerGlow)" />
        </G>
      </Svg>
    </View>
  );
}

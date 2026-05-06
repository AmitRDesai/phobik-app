import * as Haptics from 'expo-haptics';
import { Text } from '@/components/themed/Text';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { useFloatingAnimation } from '../hooks/useFloatingAnimation';

interface FloatingSphereProps {
  label: string;
  gradient: [string, string];
  shadowColor: string;
  size: number;
  onPress?: () => void;
  opacity?: number;
  floatAmplitude?: number;
  floatDuration?: number;
  blurred?: boolean;
}

export function FloatingSphere({
  label,
  gradient,
  shadowColor,
  size,
  onPress,
  opacity = 1,
  floatAmplitude = 15,
  floatDuration = 6000,
  blurred,
}: FloatingSphereProps) {
  const animatedStyle = useFloatingAnimation({
    amplitude: floatAmplitude,
    duration: floatDuration,
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  };

  const fontSize = size >= 80 ? 16 : size >= 40 ? 10 : 8;

  return (
    <Animated.View style={[{ opacity }, animatedStyle]}>
      <Pressable
        onPress={handlePress}
        className="items-center justify-center"
        style={{
          width: size,
          height: size,
          shadowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: blurred ? 0.8 : 0.6,
          shadowRadius: blurred ? size : size / 3,
          elevation: 8,
        }}
      >
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <RadialGradient id={`grad-${label}`} cx="40%" cy="35%" r="60%">
              <Stop offset="0%" stopColor={gradient[0]} stopOpacity={1} />
              <Stop offset="100%" stopColor={gradient[1]} stopOpacity={1} />
            </RadialGradient>
          </Defs>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 1}
            fill={`url(#grad-${label})`}
          />
        </Svg>
        {/* Label — dimmer on background spheres */}
        <Text
          className="absolute text-center font-bold"
          style={{
            fontSize,
            color: 'rgba(0,0,0,0.7)',
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

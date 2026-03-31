import { ViewStyle } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

interface RadialGlowProps {
  color: string;
  size: number;
  style?: ViewStyle;
}

export function RadialGlow({ color, size, style }: RadialGlowProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={[{ position: 'absolute' }, style]}
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={color} stopOpacity={0.15} />
          <Stop offset="50%" stopColor={color} stopOpacity={0.05} />
          <Stop offset="100%" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx="50" cy="50" rx="50" ry="50" fill="url(#glow)" />
    </Svg>
  );
}

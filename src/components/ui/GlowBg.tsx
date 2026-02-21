import { colors } from '@/constants/colors';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Mask,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

interface GlowBgProps {
  /** Horizontal position of glow center (0 = left, 1 = right). Default: 0.5 */
  centerX?: number;
  /** Vertical position of glow center (0 = top, 1 = bottom). Default: 0.5 */
  centerY?: number;
  /** Glow intensity multiplier (0 = none, 1 = full). Default: 1 */
  intensity?: number;
  /** Glow radius as fraction of screen size. Default: 0.4 */
  radius?: number;
  /** Gradient start color. Default: colors.chakra.orange */
  startColor?: string;
  /** Gradient end color. Default: colors.primary.pink */
  endColor?: string;
  /** Background className override. Default: "bg-background-dark" */
  bgClassName?: string;
}

export function GlowBg({
  centerX: centerXFraction = 0.5,
  centerY: centerYFraction = 0.5,
  intensity = 1,
  radius = 0.4,
  startColor = colors.chakra.orange,
  endColor = colors.primary.pink,
  bgClassName = 'bg-background-dark',
}: GlowBgProps) {
  const { width, height } = useWindowDimensions();
  const glowSize = Math.max(width, height);
  const cx = width * centerXFraction;
  const cy = height * centerYFraction;

  return (
    <View className={`absolute inset-0 ${bgClassName}`}>
      {intensity > 0 && (
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="glowMask" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="white" stopOpacity={1} />
              <Stop offset="35%" stopColor="white" stopOpacity={0.5} />
              <Stop offset="65%" stopColor="white" stopOpacity={0.15} />
              <Stop offset="100%" stopColor="white" stopOpacity={0} />
            </RadialGradient>
            <SvgLinearGradient id="glowColor" x1="0" y1="0" x2="1" y2="1">
              <Stop
                offset="0%"
                stopColor={startColor}
                stopOpacity={0.2 * intensity}
              />
              <Stop
                offset="100%"
                stopColor={endColor}
                stopOpacity={0.12 * intensity}
              />
            </SvgLinearGradient>
            <Mask id="glowFadeMask">
              <Rect width={width} height={height} fill="black" />
              <Circle
                cx={cx}
                cy={cy}
                r={glowSize * radius}
                fill="url(#glowMask)"
              />
            </Mask>
          </Defs>
          <Circle
            cx={cx}
            cy={cy}
            r={glowSize * radius}
            fill="url(#glowColor)"
            mask="url(#glowFadeMask)"
          />
        </Svg>
      )}
    </View>
  );
}

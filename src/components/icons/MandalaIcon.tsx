import { colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { View } from 'react-native';
import { EaseView } from 'react-native-ease';
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
  const scheme = useScheme();
  // SVG stroke takes a JS color string, not a className — pick a theme-aware
  // value so the mandala lines render visibly in both modes (white on dark,
  // dark gray on light).
  const stroke = scheme === 'dark' ? 'white' : '#1a1a1a';
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
      <EaseView
        initialAnimate={animated ? { opacity: 0.01, scale: 1 } : undefined}
        animate={
          animated ? { opacity: 0.2, scale: 1.1 } : { opacity: 0.15, scale: 1 }
        }
        transition={
          animated
            ? {
                type: 'timing',
                duration: 2000,
                easing: [0.455, 0.03, 0.515, 0.955],
                loop: 'reverse',
              }
            : { type: 'none' }
        }
        style={{
          position: 'absolute',
          width: size * 0.5,
          height: size * 0.5,
          backgroundColor: colors.primary.pink,
          borderRadius: size * 0.25,
          boxShadow: [
            {
              offsetX: 0,
              offsetY: 0,
              blurRadius: 30,
              color: withAlpha(colors.primary.pink, 0.6),
            },
          ],
        }}
      />

      {/* SVG Mandala */}
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          <RadialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <Stop
              offset="40%"
              stopColor={colors.primary.pink}
              stopOpacity="0.6"
            />
            <Stop
              offset="100%"
              stopColor={colors.accent.yellow}
              stopOpacity="0"
            />
          </RadialGradient>
        </Defs>

        <G transform="translate(100, 100)">
          {/* Center circle */}
          <Circle
            cx="0"
            cy="0"
            r="18"
            stroke={stroke}
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
                stroke={stroke}
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
                stroke={stroke}
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
            stroke={stroke}
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

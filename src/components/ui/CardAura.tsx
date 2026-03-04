import { useId } from 'react';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

interface CardAuraProps {
  color: string;
  opacity?: number;
}

export function CardAura({ color, opacity = 0.15 }: CardAuraProps) {
  const gradientId = `card-aura-${useId()}`;

  return (
    <Svg
      style={{ position: 'absolute', top: 0, right: -24, bottom: 0 }}
      width="100%"
      height="100%"
    >
      <Defs>
        <RadialGradient id={gradientId} cx="100%" cy="0%" rx="60%" ry="60%">
          <Stop offset="0%" stopColor={color} stopOpacity={opacity} />
          <Stop offset="100%" stopColor="transparent" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill={`url(#${gradientId})`}
      />
    </Svg>
  );
}

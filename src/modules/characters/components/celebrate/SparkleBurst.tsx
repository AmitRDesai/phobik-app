import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  active: boolean;
  count: number;
  radius: number;
  char?: string;
  color?: string;
  size?: number;
  durationMs?: number;
  delayMs?: number;
};

export function SparkleBurst({
  active,
  count,
  radius,
  char = '✦',
  color = '#FDE047',
  size = 32,
  durationMs = 800,
  delayMs = 500,
}: Props) {
  if (!active) return null;

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
      }}
    >
      {items.map((i) => {
        const angle = (i * (360 / count) * Math.PI) / 180;
        const dx = Math.cos(angle) * radius;
        const dy = Math.sin(angle) * radius;
        return (
          <Sparkle
            key={i}
            dx={dx}
            dy={dy}
            char={char}
            color={color}
            size={size}
            durationMs={durationMs}
            delayMs={delayMs}
          />
        );
      })}
    </View>
  );
}

function Sparkle({
  dx,
  dy,
  char,
  color,
  size,
  durationMs,
  delayMs,
}: {
  dx: number;
  dy: number;
  char: string;
  color: string;
  size: number;
  durationMs: number;
  delayMs: number;
}) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const sc = useSharedValue(0);
  const op = useSharedValue(0);

  useEffect(() => {
    const easing = Easing.out(Easing.cubic);
    const half = durationMs / 2;
    sc.value = withDelay(
      delayMs,
      withSequence(
        withTiming(1.5, { duration: half, easing }),
        withTiming(0, { duration: half, easing }),
      ),
    );
    op.value = withDelay(
      delayMs,
      withSequence(
        withTiming(1, { duration: half, easing }),
        withTiming(0, { duration: half, easing }),
      ),
    );
    tx.value = withDelay(
      delayMs,
      withTiming(dx, { duration: durationMs, easing }),
    );
    ty.value = withDelay(
      delayMs,
      withTiming(dy, { duration: durationMs, easing }),
    );
  }, [dx, dy, durationMs, delayMs, sc, op, tx, ty]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: sc.value },
    ],
    opacity: op.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          marginLeft: -size / 2,
          marginTop: -size / 2,
        },
        style,
      ]}
    >
      <Text style={{ fontSize: size, color, lineHeight: size }}>{char}</Text>
    </Animated.View>
  );
}

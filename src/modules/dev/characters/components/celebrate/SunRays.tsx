import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

type Ray = {
  angle: number;
  distance: number;
  height: number;
  durationMs: number;
  repeatDelayMs: number;
};

type Props = {
  active: boolean;
  count: number;
};

export function SunRays({ active, count }: Props) {
  const rays = useMemo<Ray[]>(() => {
    if (!active) return [];
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * 360,
      distance: 200 + Math.random() * 150,
      height: 20 + Math.random() * 40,
      durationMs: 400 + Math.random() * 300,
      repeatDelayMs: Math.random() * 1500,
    }));
  }, [active, count]);

  if (!active) return null;

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
      {rays.map((r, i) => (
        <Ray key={i} ray={r} />
      ))}
    </View>
  );
}

const RAY_WIDTH = 16;

function Ray({ ray }: { ray: Ray }) {
  const sc = useSharedValue(0);
  const sy = useSharedValue(1);
  const op = useSharedValue(0);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  useEffect(() => {
    const { angle, distance, durationMs, repeatDelayMs } = ray;
    const dx = Math.cos((angle * Math.PI) / 180) * distance;
    const dy = Math.sin((angle * Math.PI) / 180) * distance;
    const easing = Easing.out(Easing.cubic);
    const half = durationMs / 2;
    const hold = Math.max(1, repeatDelayMs);

    sc.value = withRepeat(
      withSequence(
        withTiming(0, { duration: hold }),
        withTiming(1.5, { duration: half, easing }),
        withTiming(0, { duration: half, easing }),
      ),
      -1,
      false,
    );
    sy.value = withRepeat(
      withSequence(
        withTiming(1, { duration: hold }),
        withTiming(2, { duration: half, easing }),
        withTiming(1, { duration: half, easing }),
      ),
      -1,
      false,
    );
    op.value = withRepeat(
      withSequence(
        withTiming(0, { duration: hold }),
        withTiming(1, { duration: half, easing }),
        withTiming(0, { duration: half, easing }),
      ),
      -1,
      false,
    );
    tx.value = withRepeat(
      withSequence(
        withTiming(0, { duration: hold }),
        withTiming(dx, { duration: durationMs, easing }),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      false,
    );
    ty.value = withRepeat(
      withSequence(
        withTiming(0, { duration: hold }),
        withTiming(dy, { duration: durationMs, easing }),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      false,
    );
  }, [ray, sc, sy, op, tx, ty]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${ray.angle + 90}deg` },
      { scale: sc.value },
      { scaleY: sy.value },
    ],
    opacity: op.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: RAY_WIDTH,
          height: ray.height,
          marginLeft: -RAY_WIDTH / 2,
          marginTop: -ray.height / 2,
        },
        style,
      ]}
    >
      <Svg width={RAY_WIDTH} height={ray.height}>
        <Defs>
          <SvgLinearGradient
            id={`ray-${ray.angle}`}
            x1="0"
            y1="1"
            x2="0"
            y2="0"
          >
            <Stop offset="0" stopColor="#FDE047" stopOpacity={1} />
            <Stop offset="1" stopColor="#FDE047" stopOpacity={0} />
          </SvgLinearGradient>
        </Defs>
        <Rect
          x={0}
          y={0}
          width={RAY_WIDTH}
          height={ray.height}
          rx={RAY_WIDTH / 2}
          fill={`url(#ray-${ray.angle})`}
        />
      </Svg>
    </Animated.View>
  );
}

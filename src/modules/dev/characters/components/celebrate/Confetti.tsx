import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Particle = {
  destX: number;
  destY: number;
  rotate: number;
  delayMs: number;
  durationMs: number;
  color: string;
};

type Props = {
  active: boolean;
  count: number;
  colors: string[];
  distanceRange: [number, number];
  delayRange: [number, number];
  durationRange: [number, number];
  /**
   * Eddy-style two-cone pattern (left cone 210–330°, right cone -30–90°).
   * Otherwise a uniform 360° spread.
   */
  splitCones?: boolean;
  size?: number;
};

export function Confetti({
  active,
  count,
  colors,
  distanceRange,
  delayRange,
  durationRange,
  splitCones = false,
  size = 12,
}: Props) {
  const particles = useMemo<Particle[]>(() => {
    if (!active) return [];
    const list: Particle[] = [];
    for (let i = 0; i < count; i++) {
      let angle: number;
      if (splitCones) {
        const side = i % 2 === 0;
        angle = side
          ? ((Math.random() * 120 + 210) * Math.PI) / 180
          : ((Math.random() * 120 - 30) * Math.PI) / 180;
      } else {
        angle = Math.random() * Math.PI * 2;
      }
      const distance =
        distanceRange[0] +
        Math.random() * (distanceRange[1] - distanceRange[0]);
      list.push({
        destX: Math.cos(angle) * distance,
        destY: Math.sin(angle) * distance,
        rotate: Math.random() * 1080,
        delayMs:
          delayRange[0] + Math.random() * (delayRange[1] - delayRange[0]),
        durationMs:
          durationRange[0] +
          Math.random() * (durationRange[1] - durationRange[0]),
        color: colors[i % colors.length],
      });
    }
    return list;
  }, [
    active,
    count,
    splitCones,
    colors,
    distanceRange,
    delayRange,
    durationRange,
  ]);

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
        overflow: 'visible',
      }}
    >
      {particles.map((p, i) => (
        <ConfettiParticle key={i} particle={p} size={size} />
      ))}
    </View>
  );
}

function ConfettiParticle({
  particle,
  size,
}: {
  particle: Particle;
  size: number;
}) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const op = useSharedValue(0);
  const sc = useSharedValue(0);
  const rt = useSharedValue(0);

  useEffect(() => {
    const easing = Easing.out(Easing.cubic);
    const { destX, destY, rotate, delayMs, durationMs } = particle;
    const appearDur = 100;
    const fadeOutDur = Math.max(200, durationMs * 0.3);
    const holdDur = Math.max(0, durationMs - appearDur - fadeOutDur);

    op.value = withDelay(
      delayMs,
      withSequence(
        withTiming(1, { duration: appearDur }),
        withTiming(1, { duration: holdDur }),
        withTiming(0, { duration: fadeOutDur }),
      ),
    );
    sc.value = withDelay(
      delayMs,
      withSequence(
        withTiming(1, { duration: appearDur }),
        withTiming(1, { duration: holdDur }),
        withTiming(0.5, { duration: fadeOutDur }),
      ),
    );
    tx.value = withDelay(
      delayMs,
      withTiming(destX, { duration: durationMs, easing }),
    );
    ty.value = withDelay(
      delayMs,
      withTiming(destY, { duration: durationMs, easing }),
    );
    rt.value = withDelay(
      delayMs,
      withTiming(rotate, { duration: durationMs, easing }),
    );
  }, [particle, op, sc, tx, ty, rt]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${rt.value}deg` },
      { scale: sc.value },
    ],
    opacity: op.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size * 2,
          borderRadius: 2,
          backgroundColor: particle.color,
          marginLeft: -size / 2,
          marginTop: -size,
        },
        style,
      ]}
    />
  );
}

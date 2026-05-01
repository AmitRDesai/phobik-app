import { useEffect } from 'react';
import {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Keyframes = {
  active: boolean;
  durationMs: number;
  repeat?: number;
  y?: number[];
  scaleX?: number[];
  scaleY?: number[];
  rotate?: number[];
  times?: number[];
};

export function useCelebrationBounce({
  active,
  durationMs,
  repeat = 1,
  y = [0, 0],
  scaleX = [1, 1],
  scaleY = [1, 1],
  rotate = [0, 0],
  times,
}: Keyframes) {
  const yV = useSharedValue(y[0]);
  const sxV = useSharedValue(scaleX[0]);
  const syV = useSharedValue(scaleY[0]);
  const rV = useSharedValue(rotate[0]);

  const yKey = y.join(',');
  const sxKey = scaleX.join(',');
  const syKey = scaleY.join(',');
  const rKey = rotate.join(',');
  const tKey = times?.join(',') ?? '';

  useEffect(() => {
    cancelAnimation(yV);
    cancelAnimation(sxV);
    cancelAnimation(syV);
    cancelAnimation(rV);

    if (!active) {
      yV.value = withTiming(0, { duration: 200 });
      sxV.value = withTiming(1, { duration: 200 });
      syV.value = withTiming(1, { duration: 200 });
      rV.value = withTiming(0, { duration: 200 });
      return;
    }

    const easing = Easing.inOut(Easing.quad);

    const buildSeq = (frames: number[]) => {
      const segments = frames.length - 1;
      if (segments < 1) return null;
      const ts =
        times && times.length === frames.length
          ? times
          : Array.from({ length: frames.length }, (_, i) => i / segments);
      const oneLoop: number[] = [];
      for (let i = 0; i < segments; i++) {
        const dur = Math.max(1, (ts[i + 1] - ts[i]) * durationMs);
        oneLoop.push(withTiming(frames[i + 1], { duration: dur, easing }));
      }
      const all: number[] = [];
      for (let r = 0; r < repeat; r++) {
        for (const step of oneLoop) all.push(step);
      }
      return all;
    };

    yV.value = y[0];
    sxV.value = scaleX[0];
    syV.value = scaleY[0];
    rV.value = rotate[0];

    const ySeq = buildSeq(y);
    const sxSeq = buildSeq(scaleX);
    const sySeq = buildSeq(scaleY);
    const rSeq = buildSeq(rotate);

    if (ySeq && ySeq.length > 0)
      yV.value = withSequence(ySeq[0], ...ySeq.slice(1));
    if (sxSeq && sxSeq.length > 0)
      sxV.value = withSequence(sxSeq[0], ...sxSeq.slice(1));
    if (sySeq && sySeq.length > 0)
      syV.value = withSequence(sySeq[0], ...sySeq.slice(1));
    if (rSeq && rSeq.length > 0)
      rV.value = withSequence(rSeq[0], ...rSeq.slice(1));
  }, [
    active,
    durationMs,
    repeat,
    yKey,
    sxKey,
    syKey,
    rKey,
    tKey,
    y,
    scaleX,
    scaleY,
    rotate,
    times,
    yV,
    sxV,
    syV,
    rV,
  ]);

  return useAnimatedStyle(() => ({
    transform: [
      { translateY: yV.value },
      { scaleX: sxV.value },
      { scaleY: syV.value },
      { rotate: `${rV.value}deg` },
    ],
  }));
}

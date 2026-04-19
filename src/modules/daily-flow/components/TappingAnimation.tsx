import { useEffect, useState } from 'react';
import { Image, Text, View, type ImageSourcePropType } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { TAPPING_POINTS, type TappingPoint } from '../data/tappingPoints';
import { TappingPointDot } from './TappingPointDot';

type Props = {
  image: ImageSourcePropType;
  accent: 'pink' | 'yellow';
  pointIndex: number;
};

const SPRING = { damping: 20, stiffness: 40 } as const;

export function TappingAnimation({ image, accent, pointIndex }: Props) {
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const point = TAPPING_POINTS[pointIndex]!;

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!containerSize.w || !containerSize.h) return;
    const txPct = 50 - point.focalX * point.zoom + (point.zoom - 1) * 50;
    const tyPct = 50 - point.focalY * point.zoom + (point.zoom - 1) * 50;
    scale.value = withSpring(point.zoom, SPRING);
    translateX.value = withSpring((txPct / 100) * containerSize.w, SPRING);
    translateY.value = withSpring((tyPct / 100) * containerSize.h, SPRING);
  }, [point, containerSize, scale, translateX, translateY]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View>
      <View className="mb-4 items-center">
        <Text className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-pink">
          {point.phaseLabel}
        </Text>
        <Text className="mt-1 text-3xl font-black tracking-tight text-white">
          {point.name}
        </Text>
      </View>
      <View
        onLayout={(e) =>
          setContainerSize({
            w: e.nativeEvent.layout.width,
            h: e.nativeEvent.layout.height,
          })
        }
        className="overflow-hidden rounded-3xl border border-white/10 bg-card-dark"
        style={{ aspectRatio: 4 / 5 }}
      >
        <Animated.View
          style={[
            imageStyle,
            {
              position: 'absolute',
              width: '100%',
              height: '100%',
            },
          ]}
        >
          <Image
            source={image}
            style={{ width: '100%', height: '100%', opacity: 0.85 }}
            resizeMode="cover"
          />
        </Animated.View>

        {containerSize.w && containerSize.h
          ? point.dots.map((dot) => (
              <DotOverlay
                key={`${point.id}-${dot.x}-${dot.y}`}
                dot={dot}
                point={point}
                containerSize={containerSize}
                accent={accent}
              />
            ))
          : null}
      </View>

      <View className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <Text className="text-xs font-bold uppercase tracking-widest text-white/50">
          Instruction
        </Text>
        <Text className="mt-1 text-base font-bold text-white">
          {point.description}
        </Text>
        <View className="my-3 h-px w-full bg-white/10" />
        <Text className="text-xs font-bold uppercase tracking-widest text-white/50">
          Benefit
        </Text>
        <Text className="mt-1 text-sm italic text-primary-pink">
          → {point.benefit}
        </Text>
      </View>
    </View>
  );
}

function DotOverlay({
  dot,
  point,
  containerSize,
  accent,
}: {
  dot: { x: number; y: number };
  point: TappingPoint;
  containerSize: { w: number; h: number };
  accent: 'pink' | 'yellow';
}) {
  const xPct = (dot.x - point.focalX) * point.zoom + 50;
  const yPct = (dot.y - point.focalY) * point.zoom + 50;
  const left = useSharedValue((xPct / 100) * containerSize.w);
  const top = useSharedValue((yPct / 100) * containerSize.h);

  useEffect(() => {
    left.value = withSpring((xPct / 100) * containerSize.w, SPRING);
    top.value = withSpring((yPct / 100) * containerSize.h, SPRING);
  }, [xPct, yPct, containerSize, left, top]);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: left.value,
    top: top.value,
  }));

  return (
    <Animated.View style={style}>
      <TappingPointDot shape={point.dotShape} accent={accent} />
    </Animated.View>
  );
}

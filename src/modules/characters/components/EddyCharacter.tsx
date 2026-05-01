import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { EaseView } from 'react-native-ease';
import { blobPath } from './blobPath';
import { Confetti } from './celebrate/Confetti';
import { SparkleBurst } from './celebrate/SparkleBurst';
import { useCelebrationBounce } from './celebrate/useCelebrationBounce';
import { useFadeIn, useFadeOut } from './celebrate/useFade';
import { Smile } from './Smile';
import { useJiggleStyle } from './useJiggle';

const BODY_W = 192;
const BODY_H = 224;
const FADE_MS = 400;

const BODY_PATH = blobPath(
  BODY_W,
  BODY_H,
  [0.4, 0.4, 0.3, 0.3],
  [0.6, 0.6, 0.4, 0.4],
);

type Props = { celebrating?: boolean };

export function EddyCharacter({ celebrating = false }: Props) {
  const [renderCelebrate, setRenderCelebrate] = useState(celebrating);
  const [renderIdle, setRenderIdle] = useState(!celebrating);

  useEffect(() => {
    if (celebrating) {
      setRenderCelebrate(true);
      setRenderIdle(false);
      return;
    }
    setRenderIdle(true);
    const t = setTimeout(() => setRenderCelebrate(false), FADE_MS);
    return () => clearTimeout(t);
  }, [celebrating]);

  return (
    <View
      style={{
        width: 280,
        height: 280,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
    >
      {renderIdle && <EddyIdle />}
      {renderCelebrate && <EddyCelebrating fading={!celebrating} />}
    </View>
  );
}

function EddyIdle() {
  const jiggleStyle = useJiggleStyle(2000);
  const fadeStyle = useFadeIn(FADE_MS);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: 280,
          height: 280,
          alignItems: 'center',
          justifyContent: 'center',
        },
        fadeStyle,
      ]}
    >
      <EaseView
        initialAnimate={{ translateY: 0 }}
        animate={{ translateY: -10 }}
        transition={{
          type: 'timing',
          duration: 1500,
          easing: 'easeInOut',
          loop: 'reverse',
        }}
      >
        <View style={{ width: BODY_W + 32, height: BODY_H + 32 }}>
          <SparkleParticle delay={200} top={0} left={0} />
          <SparkleParticle delay={500} top={40} right={0} />
          <SparkleParticle delay={800} bottom={20} left={40} />
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 16,
                left: 16,
                width: BODY_W,
                height: BODY_H,
                shadowColor: '#FF4500',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.4,
                shadowRadius: 30,
              },
              jiggleStyle,
            ]}
          >
            <EddyBody />
          </Animated.View>
        </View>
      </EaseView>
    </Animated.View>
  );
}

function EddyCelebrating({ fading }: { fading: boolean }) {
  const bodyStyle = useCelebrationBounce({
    active: true,
    durationMs: 1800,
    y: [150, 180, -250, -280, 0],
    scaleX: [1, 0.8, 1.3, 1.1, 1],
    scaleY: [1, 0.8, 1.3, 1.1, 1],
    rotate: [0, 0, 15, -15, 0],
    times: [0, 0.2, 0.4, 0.6, 1],
  });
  const shakeStyle = useShakeStyle({
    delayMs: 500,
    durationMs: 400,
    x: [0, -5, 5, -5, 5, 0],
    y: [0, 5, -5, 5, -5, 0],
  });
  const fadeStyle = useFadeOut(fading, FADE_MS);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: 280,
          height: 280,
          alignItems: 'center',
          justifyContent: 'center',
        },
        fadeStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            width: 280,
            height: 280,
            alignItems: 'center',
            justifyContent: 'center',
          },
          shakeStyle,
        ]}
      >
        <YellowGlowBurst />

        <SparkleBurst
          active
          count={12}
          radius={250}
          char="✦"
          color="#FDE047"
          size={32}
          durationMs={800}
          delayMs={500}
        />

        <Confetti
          active
          count={40}
          colors={[
            '#FFD700',
            '#FF1493',
            '#00FF00',
            '#00BFFF',
            '#FF4500',
            '#FFFFFF',
          ]}
          distanceRange={[300, 700]}
          delayRange={[500, 500]}
          durationRange={[1500, 2500]}
          splitCones
        />

        <Animated.View
          style={[
            {
              width: BODY_W,
              height: BODY_H,
              shadowColor: '#FF4500',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.4,
              shadowRadius: 30,
            },
            bodyStyle,
          ]}
        >
          <EddyBody />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

function YellowGlowBurst() {
  const sc = useSharedValue(0.5);
  const op = useSharedValue(0);

  useEffect(() => {
    const easing = Easing.out(Easing.cubic);
    sc.value = withDelay(
      400,
      withSequence(
        withTiming(2.5, { duration: 360, easing }),
        withTiming(2.5, { duration: 840, easing }),
      ),
    );
    op.value = withDelay(
      400,
      withSequence(
        withTiming(1, { duration: 360, easing }),
        withTiming(0, { duration: 840, easing }),
      ),
    );
  }, [sc, op]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: sc.value }],
    opacity: op.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: 384,
          height: 384,
          borderRadius: 192,
          backgroundColor: 'rgba(250, 204, 21, 0.4)',
        },
        style,
      ]}
    />
  );
}

function useShakeStyle({
  delayMs,
  durationMs,
  x,
  y,
}: {
  delayMs: number;
  durationMs: number;
  x: number[];
  y: number[];
}) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  useEffect(() => {
    const xStep = durationMs / Math.max(1, x.length - 1);
    const yStep = durationMs / Math.max(1, y.length - 1);
    const xSeq = x.slice(1).map((v) => withTiming(v, { duration: xStep }));
    const ySeq = y.slice(1).map((v) => withTiming(v, { duration: yStep }));
    if (xSeq.length > 0) {
      tx.value = withDelay(delayMs, withSequence(xSeq[0], ...xSeq.slice(1)));
    }
    if (ySeq.length > 0) {
      ty.value = withDelay(delayMs, withSequence(ySeq[0], ...ySeq.slice(1)));
    }
  }, [delayMs, durationMs, x, y, tx, ty]);

  return useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
  }));
}

function EddyBody() {
  return (
    <View style={{ width: BODY_W, height: BODY_H }}>
      <Svg width={BODY_W} height={BODY_H} style={{ position: 'absolute' }}>
        <Defs>
          <SvgLinearGradient id="eddyBody" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FF4500" />
            <Stop offset="1" stopColor="#FF8C00" />
          </SvgLinearGradient>
        </Defs>
        <Path d={BODY_PATH} fill="url(#eddyBody)" />
      </Svg>

      <View
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          right: 0,
          height: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderTopWidth: 2,
          borderBottomWidth: 2,
          borderColor: 'rgba(229, 231, 235, 1)',
        }}
      />

      <View
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}
      >
        <View className="flex-row" style={{ gap: 16 }}>
          <Eye />
          <Eye />
        </View>
        <View style={{ marginTop: 12 }}>
          <Smile width={48} height={16} color="white" />
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          left: -8,
          top: 128,
          width: 16,
          height: 24,
          borderRadius: 4,
          backgroundColor: 'white',
          borderRightWidth: 2,
          borderColor: 'rgba(229, 231, 235, 1)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: -8,
          top: 128,
          width: 16,
          height: 24,
          borderRadius: 4,
          backgroundColor: 'white',
          borderLeftWidth: 2,
          borderColor: 'rgba(229, 231, 235, 1)',
        }}
      />
    </View>
  );
}

function Eye() {
  return (
    <View
      style={{
        width: 32,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: 'black',
        }}
      />
    </View>
  );
}

function SparkleParticle({
  delay,
  top,
  bottom,
  left,
  right,
}: {
  delay: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}) {
  return (
    <EaseView
      style={{
        position: 'absolute',
        top,
        bottom,
        left,
        right,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'white',
      }}
      initialAnimate={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'timing',
        duration: 750,
        delay,
        easing: 'linear',
        loop: 'reverse',
      }}
    />
  );
}

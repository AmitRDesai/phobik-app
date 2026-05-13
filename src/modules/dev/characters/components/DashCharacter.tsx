import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { EaseView } from 'react-native-ease';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { blobPath } from './blobPath';
import { Confetti } from './celebrate/Confetti';
import { useCelebrationBounce } from './celebrate/useCelebrationBounce';
import { useFadeIn, useFadeOut } from './celebrate/useFade';
import { Smile } from './Smile';
import { useJiggleStyle } from './useJiggle';

const BODY_W = 128;
const BODY_H = 144;
const FADE_MS = 400;

const BODY_PATH = blobPath(
  BODY_W,
  BODY_H,
  [0.3, 0.7, 0.7, 0.3],
  [0.3, 0.3, 0.7, 0.7],
);

type Props = { celebrating?: boolean };

export function DashCharacter({ celebrating = false }: Props) {
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
      {renderIdle && <DashIdle />}
      {renderCelebrate && <DashCelebrating fading={!celebrating} />}
    </View>
  );
}

function DashIdle() {
  const jiggleStyle = useJiggleStyle(2400);
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
        className="absolute rounded-full"
        style={{
          width: 208,
          height: 208,
          borderWidth: 1,
          borderColor: 'rgba(0, 242, 255, 0.3)',
          borderStyle: 'dashed',
        }}
        initialAnimate={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          type: 'timing',
          duration: 8000,
          easing: 'linear',
          loop: 'repeat',
        }}
      />

      <View
        className="absolute rounded-full"
        style={{
          width: 240,
          height: 240,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.05)',
        }}
      />

      <EaseView
        initialAnimate={{ translateY: 0 }}
        animate={{ translateY: -15 }}
        transition={{
          type: 'timing',
          duration: 2000,
          easing: 'easeInOut',
          loop: 'reverse',
        }}
      >
        <View
          style={{
            width: BODY_W + 80,
            height: BODY_H + 40,
            alignItems: 'center',
          }}
        >
          <Animated.View
            style={[
              {
                marginTop: 40,
                width: BODY_W,
                height: BODY_H,
                shadowColor: '#00F2FF',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
              },
              jiggleStyle,
            ]}
          >
            <DashBody>
              <View
                style={{
                  position: 'absolute',
                  top: -24,
                  left: BODY_W / 2 - 32,
                }}
              >
                <LightningBolt />
              </View>

              <EaseView
                style={{ position: 'absolute', right: -16, bottom: 16 }}
                initialAnimate={{ translateY: 0 }}
                animate={{ translateY: -8 }}
                transition={{
                  type: 'timing',
                  duration: 500,
                  easing: 'easeInOut',
                  loop: 'reverse',
                }}
              >
                <Trophy size={32} />
              </EaseView>
            </DashBody>
          </Animated.View>

          <DashStar
            top={32}
            right={0}
            size={24}
            color="#FF6B00"
            durationMs={2000}
            direction={1}
          />
          <DashStar
            bottom={8}
            left={-8}
            size={16}
            color="#00F2FF"
            durationMs={2000}
            direction={-1}
            delay={500}
          />
        </View>
      </EaseView>
    </Animated.View>
  );
}

function DashCelebrating({ fading }: { fading: boolean }) {
  const bodyStyle = useCelebrationBounce({
    active: true,
    durationMs: 600,
    repeat: 5,
    y: [0, -150, 0, 0],
    scaleX: [1, 1.3, 0.7, 1],
    scaleY: [1, 0.7, 1.3, 1],
    rotate: [0, 0],
    times: [0, 0.2, 0.5, 1],
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
      <Confetti
        active
        count={60}
        colors={['#00F2FF', '#FF6B00', '#FFEB3B', '#FF0080', '#7C4DFF']}
        distanceRange={[200, 600]}
        delayRange={[0, 800]}
        durationRange={[2200, 2500]}
      />

      <EaseView
        className="absolute rounded-full"
        style={{
          width: 320,
          height: 320,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.2)',
        }}
        initialAnimate={{ scale: 1, opacity: 0.1 }}
        animate={{ scale: 1.2, opacity: 0.3 }}
        transition={{
          type: 'timing',
          duration: 1000,
          easing: 'easeInOut',
          loop: 'reverse',
        }}
      />

      <EaseView
        className="absolute rounded-full"
        style={{
          width: 208,
          height: 208,
          borderWidth: 2,
          borderColor: 'rgba(0, 242, 255, 0.4)',
          borderStyle: 'dashed',
        }}
        initialAnimate={{ rotate: 0, scale: 1 }}
        animate={{ rotate: 360, scale: 1.1 }}
        transition={{
          type: 'timing',
          duration: 5000,
          easing: 'linear',
          loop: 'repeat',
        }}
      />

      <Animated.View
        style={[
          {
            width: BODY_W + 80,
            height: BODY_H + 40,
            alignItems: 'center',
          },
          bodyStyle,
        ]}
      >
        <View
          style={{
            marginTop: 40,
            width: BODY_W,
            height: BODY_H,
            shadowColor: '#00F2FF',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 30,
          }}
        >
          <DashBody>
            <EaseView
              style={{ position: 'absolute', top: -24, left: BODY_W / 2 - 32 }}
              initialAnimate={{ rotate: -10, scale: 1 }}
              animate={{ rotate: 10, scale: 1.2 }}
              transition={{
                type: 'timing',
                duration: 300,
                easing: 'easeInOut',
                loop: 'reverse',
              }}
            >
              <LightningBolt />
            </EaseView>

            <EaseView
              style={{ position: 'absolute', right: -16, bottom: 16 }}
              initialAnimate={{ rotate: -20, translateY: 0 }}
              animate={{ rotate: 20, translateY: -20 }}
              transition={{
                type: 'timing',
                duration: 400,
                easing: 'easeInOut',
                loop: 'reverse',
              }}
            >
              <Trophy size={32} />
            </EaseView>
          </DashBody>
        </View>

        <DashStar
          top={32}
          right={0}
          size={28}
          color="#FF6B00"
          durationMs={500}
          direction={1}
          maxScale={2}
        />
        <DashStar
          bottom={8}
          left={-8}
          size={20}
          color="#00F2FF"
          durationMs={700}
          direction={-1}
          delay={250}
          maxScale={1.8}
        />
      </Animated.View>
    </Animated.View>
  );
}

function DashBody({ children }: { children?: React.ReactNode }) {
  return (
    <View style={{ width: BODY_W, height: BODY_H }}>
      <Svg width={BODY_W} height={BODY_H} style={{ position: 'absolute' }}>
        <Defs>
          <SvgLinearGradient id="dashBody" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#00F2FF" />
            <Stop offset="1" stopColor="#FF6B00" />
          </SvgLinearGradient>
        </Defs>
        <Path d={BODY_PATH} fill="url(#dashBody)" />
      </Svg>

      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View className="flex-row" style={{ gap: 20, marginBottom: 12 }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: '#0A0A0A',
            }}
          />
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: '#0A0A0A',
            }}
          />
        </View>
        <Smile width={40} height={20} color="#0A0A0A" />
      </View>

      {children}
    </View>
  );
}

function LightningBolt() {
  return (
    <Svg width={64} height={64} viewBox="0 0 24 24">
      <Path d="M13 2L3 14h9v8l10-12h-9l1-8z" fill="#FF6B00" />
    </Svg>
  );
}

function Trophy({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M18 2H6v2H2v7c0 2.21 1.79 4 4 4h1.09c.47 1.83 2.1 3.2 4.09 3.51V20H8v2h8v-2h-3.18c1.99-.31 3.62-1.68 4.09-3.51H18c2.21 0 4-1.79 4-4V4h-4V2zm-12 9V6h2v5c0 .55-.45 1-1 1s-1-.45-1-1zm12 0c0 .55-.45 1-1 1s-1-.45-1-1V6h2v5z"
        fill="#FACC15"
      />
    </Svg>
  );
}

function DashStar({
  top,
  bottom,
  left,
  right,
  size,
  color,
  durationMs,
  direction,
  delay = 0,
  maxScale = 1.2,
}: {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  size: number;
  color: string;
  durationMs: number;
  direction: 1 | -1;
  delay?: number;
  maxScale?: number;
}) {
  return (
    <EaseView
      style={{ position: 'absolute', top, bottom, left, right }}
      initialAnimate={{ rotate: 0, scale: 1 }}
      animate={{ rotate: 360 * direction, scale: maxScale }}
      transition={{
        type: 'timing',
        duration: durationMs,
        delay,
        easing: 'linear',
        loop: 'repeat',
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"
          fill={color}
        />
      </Svg>
    </EaseView>
  );
}

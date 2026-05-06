import { withAlpha } from '@/constants/colors';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { EaseView } from 'react-native-ease';
import { blobPath } from './blobPath';
import { SunRays } from './celebrate/SunRays';
import { useCelebrationBounce } from './celebrate/useCelebrationBounce';
import { useFadeIn, useFadeOut } from './celebrate/useFade';
import { Smile } from './Smile';
import { useJiggleStyle } from './useJiggle';

const BODY_W = 144;
const BODY_H = 160;
const FADE_MS = 400;

const BODY_PATH = blobPath(
  BODY_W,
  BODY_H,
  [0.4, 0.6, 0.7, 0.3],
  [0.5, 0.6, 0.4, 0.5],
);

type Props = { celebrating?: boolean };

export function SunnyCharacter({ celebrating = false }: Props) {
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
        width: 320,
        height: 320,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
    >
      {renderIdle && <SunnyIdle />}
      {renderCelebrate && <SunnyCelebrating fading={!celebrating} />}
    </View>
  );
}

function SunnyIdle() {
  const jiggleStyle = useJiggleStyle(2200);
  const fadeStyle = useFadeIn(FADE_MS);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: 320,
          height: 320,
          alignItems: 'center',
          justifyContent: 'center',
        },
        fadeStyle,
      ]}
    >
      <EaseView
        className="absolute rounded-full bg-yellow-400/20"
        style={{ width: 256, height: 256 }}
        initialAnimate={{ opacity: 0.6, scale: 1 }}
        animate={{ opacity: 1, scale: 1.05 }}
        transition={{
          type: 'timing',
          duration: 1500,
          easing: 'easeInOut',
          loop: 'reverse',
        }}
      />

      <View
        className="absolute rounded-full"
        style={{
          width: 192,
          height: 192,
          backgroundColor: 'rgba(255,255,255,0.9)',
          opacity: 0.18,
        }}
      />

      <EaseView
        className="absolute rounded-full"
        style={{
          width: 288,
          height: 288,
          borderWidth: 1,
          borderColor: 'rgba(255, 215, 0, 0.1)',
        }}
        initialAnimate={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          type: 'timing',
          duration: 12000,
          easing: 'linear',
          loop: 'repeat',
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
            width: BODY_W + 24,
            height: BODY_H + 24,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <EaseView
            className="absolute rounded-full"
            style={{
              width: BODY_W + 48,
              height: BODY_H + 48,
              borderWidth: 2,
              borderColor: 'rgba(255, 215, 0, 0.4)',
              borderStyle: 'dashed',
            }}
            initialAnimate={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              type: 'timing',
              duration: 12000,
              easing: 'linear',
              loop: 'repeat',
            }}
          />

          <Animated.View
            style={[
              {
                width: BODY_W,
                height: BODY_H,
                boxShadow: `0px 0px 15px ${withAlpha('#FFD700', 0.6)}`,
              },
              jiggleStyle,
            ]}
          >
            <SunnyBody />
          </Animated.View>

          <SunnySparkle
            delay={0}
            top={-8}
            right={-24}
            char="✦"
            color="#FFD700"
            size={20}
          />
          <SunnySparkle
            delay={250}
            top={BODY_H / 2}
            left={-32}
            char="✧"
            color="#FFFACD"
            size={18}
          />
          <SunnySparkle
            delay={500}
            bottom={8}
            right={-16}
            char="✦"
            color="#FFFFFF"
            size={16}
          />
        </View>
      </EaseView>
    </Animated.View>
  );
}

function SunnyCelebrating({ fading }: { fading: boolean }) {
  const bodyStyle = useCelebrationBounce({
    active: true,
    durationMs: 600,
    repeat: 4,
    y: [0, -100, 0],
    scaleX: [1, 0.8, 1.2, 1],
    scaleY: [1, 1.3, 0.7, 1],
    rotate: [0, 0],
    times: [0, 0.4, 0.6, 1],
  });
  const fadeStyle = useFadeOut(fading, FADE_MS);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: 320,
          height: 320,
          alignItems: 'center',
          justifyContent: 'center',
        },
        fadeStyle,
      ]}
    >
      <BackgroundSpokes />

      <SunRays active count={24} />

      <Animated.View
        style={[
          {
            width: BODY_W,
            height: BODY_H,
            boxShadow: `0px 0px 20px ${withAlpha('#FFD700', 0.6)}`,
          },
          bodyStyle,
        ]}
      >
        <SunnyBody />
      </Animated.View>

      <SunnySparkle
        delay={0}
        top={20}
        right={20}
        char="✦"
        color="#FDE047"
        size={28}
      />
      <SunnySparkle
        delay={300}
        top={140}
        left={20}
        char="✧"
        color="#FFFACD"
        size={24}
      />
      <SunnySparkle
        delay={600}
        bottom={40}
        right={40}
        char="✦"
        color="#FFFFFF"
        size={22}
      />
    </Animated.View>
  );
}

function BackgroundSpokes() {
  const spokes = Array.from({ length: 12 }, (_, i) => i);
  return (
    <EaseView
      style={{
        position: 'absolute',
        width: 500,
        height: 500,
        opacity: 0.2,
      }}
      initialAnimate={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        type: 'timing',
        duration: 10000,
        easing: 'linear',
        loop: 'repeat',
      }}
    >
      {spokes.map((i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 4,
            height: 250,
            marginLeft: -2,
            marginTop: -250,
            backgroundColor: '#FACC15',
            transform: [{ rotate: `${i * 30}deg` }, { translateY: -125 }],
          }}
        />
      ))}
    </EaseView>
  );
}

function SunnyBody() {
  return (
    <View style={{ width: BODY_W, height: BODY_H }}>
      <Svg width={BODY_W} height={BODY_H} style={{ position: 'absolute' }}>
        <Defs>
          <SvgLinearGradient id="sunnyBody" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFD700" />
            <Stop offset="1" stopColor="#FB923C" />
          </SvgLinearGradient>
        </Defs>
        <Path d={BODY_PATH} fill="url(#sunnyBody)" />
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
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: '#0A0A0A',
            }}
          />
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: '#0A0A0A',
            }}
          />
        </View>
        <Smile width={40} height={20} color="#0A0A0A" />
      </View>

      <View
        style={{
          position: 'absolute',
          top: 32,
          left: 16,
          width: 24,
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.4)',
          transform: [{ rotate: '12deg' }],
        }}
      />
    </View>
  );
}

function SunnySparkle({
  delay,
  top,
  bottom,
  left,
  right,
  char,
  color,
  size,
}: {
  delay: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  char: string;
  color: string;
  size: number;
}) {
  return (
    <EaseView
      style={{ position: 'absolute', top, bottom, left, right }}
      initialAnimate={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1.2 }}
      transition={{
        type: 'timing',
        duration: 750,
        delay,
        easing: 'linear',
        loop: 'reverse',
      }}
    >
      <Text style={{ fontSize: size, color }}>{char}</Text>
    </EaseView>
  );
}

import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { EaseView } from 'react-native-ease';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { blobPath } from './blobPath';
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
  [0.5, 0.5, 0.45, 0.45],
  [0.6, 0.6, 0.4, 0.4],
);

type Props = { celebrating?: boolean };

export function OliveCharacter({ celebrating = false }: Props) {
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
      {renderIdle && <OliveIdle />}
      {renderCelebrate && <OliveCelebrating fading={!celebrating} />}
    </View>
  );
}

function OliveIdle() {
  const jiggleStyle = useJiggleStyle(2200);
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
      <TrustRing />

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
        <View
          style={{
            width: BODY_W + 64,
            height: BODY_H + 32,
            alignItems: 'center',
          }}
        >
          <CloudParts />

          <Animated.View
            style={[
              {
                marginTop: 16,
                width: BODY_W,
                height: BODY_H,
                shadowColor: '#FF9ECD',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 15,
              },
              jiggleStyle,
            ]}
          >
            <OliveBody />
          </Animated.View>

          <HeartPendant />
        </View>
      </EaseView>
    </Animated.View>
  );
}

function OliveCelebrating({ fading }: { fading: boolean }) {
  const bodyStyle = useCelebrationBounce({
    active: true,
    durationMs: 1200,
    repeat: 2,
    y: [0, -100, 0, -80, 0, -40, 0],
    scaleX: [1, 0.8, 1.2, 0.9, 1.1, 0.95, 1],
    scaleY: [1, 1.2, 0.8, 1.1, 0.9, 1.05, 1],
    rotate: [0, -5, 5, -3, 3, 0, 0],
    times: [0, 0.2, 0.4, 0.6, 0.7, 0.85, 1],
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
      <PinkHalo />
      <TrustRing />

      <Animated.View
        style={[
          {
            width: BODY_W + 64,
            height: BODY_H + 32,
            alignItems: 'center',
          },
          bodyStyle,
        ]}
      >
        <CloudParts />

        <View
          style={{
            marginTop: 16,
            width: BODY_W,
            height: BODY_H,
            shadowColor: '#FF9ECD',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 20,
          }}
        >
          <OliveBody />
        </View>

        <HeartPendant />
      </Animated.View>
    </Animated.View>
  );
}

function PinkHalo() {
  return (
    <EaseView
      className="absolute rounded-full"
      style={{
        width: 240,
        height: 240,
        backgroundColor: 'rgba(255, 158, 205, 0.4)',
      }}
      initialAnimate={{ opacity: 0.4, scale: 1 }}
      animate={{ opacity: 0.8, scale: 1.5 }}
      transition={{
        type: 'timing',
        duration: 600,
        easing: 'easeInOut',
        loop: 'reverse',
      }}
    />
  );
}

function TrustRing() {
  return (
    <EaseView
      className="absolute rounded-full"
      style={{
        width: 224,
        height: 224,
        borderWidth: 2,
        borderColor: 'rgba(224, 176, 255, 0.4)',
        borderStyle: 'dashed',
        shadowColor: '#FF9ECD',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 30,
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
  );
}

function CloudParts() {
  return (
    <>
      <CloudPart top={0} left={20} size={64} delay={0} tint="#FF9ECD" />
      <CloudPart top={8} right={8} size={56} delay={1000} tint="#E0B0FF" />
      <CloudPart top={-16} left={62} size={80} delay={500} tint="#FF9ECD" />
      <CloudPart bottom={40} left={-16} size={48} delay={1500} tint="#E0B0FF" />
      <CloudPart bottom={48} right={-8} size={40} delay={2000} tint="#FF9ECD" />
    </>
  );
}

function OliveBody() {
  return (
    <View style={{ width: BODY_W, height: BODY_H }}>
      <Svg width={BODY_W} height={BODY_H} style={{ position: 'absolute' }}>
        <Defs>
          <SvgLinearGradient id="oliveBody" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFB7D5" />
            <Stop offset="1" stopColor="#D8B4FE" />
          </SvgLinearGradient>
        </Defs>
        <Path
          d={BODY_PATH}
          fill="url(#oliveBody)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1}
        />
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
          <Eye />
          <Eye />
        </View>
        <Smile width={40} height={20} color="#0A0A0A" />
        <Text
          style={{
            position: 'absolute',
            bottom: 24,
            color: 'rgba(255,255,255,0.4)',
            fontSize: 10,
          }}
        >
          ❤
        </Text>
      </View>
    </View>
  );
}

function HeartPendant() {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: -16,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
      }}
    >
      <EaseView
        className="absolute rounded-full"
        style={{
          width: 40,
          height: 40,
          backgroundColor: 'rgba(255, 158, 205, 0.4)',
        }}
        initialAnimate={{ scale: 1, opacity: 0.4 }}
        animate={{ scale: 2.4, opacity: 0 }}
        transition={{
          type: 'timing',
          duration: 2000,
          easing: 'easeOut',
          loop: 'repeat',
        }}
      />
      <View
        className="items-center justify-center rounded-full bg-white"
        style={{
          width: 40,
          height: 40,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
        }}
      >
        <Text style={{ fontSize: 18, color: '#EC4899' }}>♥</Text>
      </View>
    </View>
  );
}

function Eye() {
  return (
    <View
      style={{
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#0A0A0A',
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: 2,
          right: 2,
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: 'white',
        }}
      />
    </View>
  );
}

function CloudPart({
  size,
  delay,
  top,
  bottom,
  left,
  right,
  tint = '#FF9ECD',
}: {
  size: number;
  delay: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  tint?: string;
}) {
  const padded = size * 1.6;
  const id = `oliveCloudGlow-${size}-${delay}`;

  return (
    <EaseView
      style={{
        position: 'absolute',
        top: top !== undefined ? top - (padded - size) / 2 : undefined,
        bottom: bottom !== undefined ? bottom - (padded - size) / 2 : undefined,
        left: left !== undefined ? left - (padded - size) / 2 : undefined,
        right: right !== undefined ? right - (padded - size) / 2 : undefined,
        width: padded,
        height: padded,
        opacity: 0.8,
      }}
      initialAnimate={{ translateX: 0, scale: 1 }}
      animate={{ translateX: 5, scale: 1.05 }}
      transition={{
        type: 'timing',
        duration: 5000,
        delay,
        easing: 'easeInOut',
        loop: 'reverse',
      }}
    >
      <Svg width={padded} height={padded}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={tint} stopOpacity={0.9} />
            <Stop offset="0.4" stopColor={tint} stopOpacity={0.45} />
            <Stop offset="0.75" stopColor={tint} stopOpacity={0.15} />
            <Stop offset="1" stopColor={tint} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle
          cx={padded / 2}
          cy={padded / 2}
          r={padded / 2}
          fill={`url(#${id})`}
        />
      </Svg>
    </EaseView>
  );
}

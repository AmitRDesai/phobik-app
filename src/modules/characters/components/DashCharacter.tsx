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
import { Smile } from './Smile';
import { useJiggleStyle } from './useJiggle';

const BODY_W = 128;
const BODY_H = 144;

// Design CSS: border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%
const BODY_PATH = blobPath(
  BODY_W,
  BODY_H,
  [0.3, 0.7, 0.7, 0.3],
  [0.3, 0.3, 0.7, 0.7],
);

export function DashCharacter() {
  const jiggleStyle = useJiggleStyle(2400);

  return (
    <View
      className="items-center justify-center"
      style={{ width: 280, height: 280 }}
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
            <Svg
              width={BODY_W}
              height={BODY_H}
              style={{ position: 'absolute' }}
            >
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

            <View
              style={{ position: 'absolute', top: -24, left: BODY_W / 2 - 32 }}
            >
              <Svg width={64} height={64} viewBox="0 0 24 24">
                <Path d="M13 2L3 14h9v8l10-12h-9l1-8z" fill="#FF6B00" />
              </Svg>
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
              <Svg width={32} height={32} viewBox="0 0 24 24">
                <Path
                  d="M18 2H6v2H2v7c0 2.21 1.79 4 4 4h1.09c.47 1.83 2.1 3.2 4.09 3.51V20H8v2h8v-2h-3.18c1.99-.31 3.62-1.68 4.09-3.51H18c2.21 0 4-1.79 4-4V4h-4V2zm-12 9V6h2v5c0 .55-.45 1-1 1s-1-.45-1-1zm12 0c0 .55-.45 1-1 1s-1-.45-1-1V6h2v5z"
                  fill="#FACC15"
                />
              </Svg>
            </EaseView>
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
    </View>
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
}) {
  return (
    <EaseView
      style={{ position: 'absolute', top, bottom, left, right }}
      initialAnimate={{ rotate: 0, scale: 1 }}
      animate={{ rotate: 360 * direction, scale: 1.2 }}
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

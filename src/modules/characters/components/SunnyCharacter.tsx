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
import { Smile } from './Smile';
import { useJiggleStyle } from './useJiggle';

const BODY_W = 144;
const BODY_H = 160;

// Design CSS: border-radius: 40% 60% 70% 30% / 50% 60% 40% 50%
const BODY_PATH = blobPath(
  BODY_W,
  BODY_H,
  [0.4, 0.6, 0.7, 0.3],
  [0.5, 0.6, 0.4, 0.5],
);

export function SunnyCharacter() {
  const jiggleStyle = useJiggleStyle(2200);

  return (
    <View
      className="items-center justify-center"
      style={{ width: 320, height: 320 }}
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
                shadowColor: '#FFD700',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 15,
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

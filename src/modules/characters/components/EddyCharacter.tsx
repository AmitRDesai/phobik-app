import { View } from 'react-native';
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

const BODY_W = 192;
const BODY_H = 224;

// Design CSS: border-radius: 40% 40% 30% 30% / 60% 60% 40% 40%
const BODY_PATH = blobPath(
  BODY_W,
  BODY_H,
  [0.4, 0.4, 0.3, 0.3],
  [0.6, 0.6, 0.4, 0.4],
);

export function EddyCharacter() {
  const jiggleStyle = useJiggleStyle(2000);

  return (
    <View
      className="items-center justify-center"
      style={{ width: 280, height: 280 }}
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
            <Svg
              width={BODY_W}
              height={BODY_H}
              style={{ position: 'absolute' }}
            >
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
          </Animated.View>
        </View>
      </EaseView>
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

import { colors } from '@/constants/colors';
import { View } from 'react-native';
import { EaseView } from 'react-native-ease';

type Props = {
  shape: 'circle' | 'ellipse';
  accent: 'pink' | 'yellow';
};

const DOT_SIZES = {
  circle: { outer: 40, inner: 20, core: 8 },
  ellipse: { outer: 56, inner: 28, core: 12 },
} as const;

export function TappingPointDot({ shape, accent }: Props) {
  const sizes = DOT_SIZES[shape];
  const color = accent === 'pink' ? colors.primary.pink : colors.accent.yellow;
  const outerH = shape === 'ellipse' ? sizes.outer / 2 : sizes.outer;
  const innerH = shape === 'ellipse' ? sizes.inner / 2 : sizes.inner;
  const coreH = shape === 'ellipse' ? sizes.core / 2 : sizes.core;

  return (
    <>
      <EaseView
        initialAnimate={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 250,
          easing: 'linear',
          loop: 'reverse',
        }}
        className="absolute"
        style={{
          width: sizes.outer,
          height: outerH,
          borderRadius: shape === 'ellipse' ? sizes.outer : sizes.outer / 2,
          backgroundColor: color,
          left: -sizes.outer / 2,
          top: -outerH / 2,
        }}
      />
      <EaseView
        initialAnimate={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 250,
          easing: 'linear',
          loop: 'reverse',
        }}
        className="absolute"
        style={{
          width: sizes.inner,
          height: innerH,
          borderRadius: shape === 'ellipse' ? sizes.inner : sizes.inner / 2,
          backgroundColor: color,
          left: -sizes.inner / 2,
          top: -innerH / 2,
        }}
      />
      <View
        className="absolute bg-white"
        style={{
          width: sizes.core,
          height: coreH,
          borderRadius: shape === 'ellipse' ? sizes.core : sizes.core / 2,
          left: -sizes.core / 2,
          top: -coreH / 2,
        }}
      />
    </>
  );
}

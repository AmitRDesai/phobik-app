import Svg, { Path } from 'react-native-svg';

type Props = {
  width: number;
  height: number;
  color: string;
  borderWidth?: number;
};

/**
 * Filled SVG path that matches CSS rendering of
 * `<div class="w-X h-Y border-b-N rounded-full">`.
 *
 * On a `width × height` box with `border-radius` clamped to half the smaller
 * dimension and only a bottom border of `borderWidth`:
 *   - outer corner: rx = ry = r  (circle)
 *   - inner corner: rx = r, ry = r - borderWidth  (vertically squashed ellipse —
 *     since border-left/right are 0, horizontal radius stays the same)
 *   - the two curves meet at a point at each tip, so the band tapers to zero
 *     thickness at the edges and is full `borderWidth` only along the flat middle.
 */
export function Smile({ width, height, color, borderWidth = 4 }: Props) {
  const r = Math.min(width, height) / 2;
  const innerRy = Math.max(0, r - borderWidth);
  const innerY = height - borderWidth;

  const path = [
    `M 0 ${r}`,
    `A ${r} ${r} 0 0 0 ${r} ${height}`,
    `L ${width - r} ${height}`,
    `A ${r} ${r} 0 0 0 ${width} ${r}`,
    `A ${r} ${innerRy} 0 0 1 ${width - r} ${innerY}`,
    `L ${r} ${innerY}`,
    `A ${r} ${innerRy} 0 0 1 0 ${r}`,
    'Z',
  ].join(' ');

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Path d={path} fill={color} />
    </Svg>
  );
}

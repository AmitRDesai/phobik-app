/**
 * Build an SVG path that mirrors CSS `border-radius` with elliptical corners.
 * Pass corner radii as fractions of width / height, in TL → TR → BR → BL order.
 *
 * Mirrors CSS `border-radius: TL TR BR BL / TL TR BR BL` (per-corner X / Y radii).
 */
export function blobPath(
  width: number,
  height: number,
  hFracs: [number, number, number, number],
  vFracs: [number, number, number, number],
): string {
  const [tlH, trH, brH, blH] = hFracs;
  const [tlV, trV, brV, blV] = vFracs;

  const tlX = tlH * width;
  const tlY = tlV * height;
  const trX = trH * width;
  const trY = trV * height;
  const brX = brH * width;
  const brY = brV * height;
  const blX = blH * width;
  const blY = blV * height;

  return [
    `M 0 ${tlY}`,
    `A ${tlX} ${tlY} 0 0 1 ${tlX} 0`,
    `L ${width - trX} 0`,
    `A ${trX} ${trY} 0 0 1 ${width} ${trY}`,
    `L ${width} ${height - brY}`,
    `A ${brX} ${brY} 0 0 1 ${width - brX} ${height}`,
    `L ${blX} ${height}`,
    `A ${blX} ${blY} 0 0 1 0 ${height - blY}`,
    'Z',
  ].join(' ');
}

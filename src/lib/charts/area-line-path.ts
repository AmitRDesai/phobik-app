/**
 * Builds SVG `line` + `area` path strings for a simple sparkline/trend chart
 * from a series of numeric values, normalized to a viewBox. Shared by the
 * insights HRV chart and the My Rhythm trend charts.
 */
export function buildAreaLinePath(
  values: number[],
  opts: { width?: number; height?: number; pad?: number } = {},
): { line: string; area: string } {
  const { width = 400, height = 150, pad = 8 } = opts;
  if (values.length < 2) return { line: '', area: '' };

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const xStep = (width - pad * 2) / (values.length - 1);
  const coords = values.map((v, i) => ({
    x: pad + i * xStep,
    y: pad + (height - pad * 2) * (1 - (v - min) / range),
  }));

  const line = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(' ');
  const first = coords[0];
  const last = coords[coords.length - 1];
  const area = `${line} L${last.x.toFixed(1)},${height} L${first.x.toFixed(1)},${height} Z`;
  return { line, area };
}

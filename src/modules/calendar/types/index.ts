export type CheckInTiming = '2-days' | 'day-of' | '1-hour';

export type SupportTone = 'gentle' | 'subtle' | 'direct';

export interface DeviceCalendar {
  id: string;
  stableId: string;
  title: string;
  color: string;
  sourceName: string;
  sourceType: string;
}

/** Deterministic hash of calendar fingerprint — stable across reinstalls */
export function calendarStableId(
  sourceType: string,
  sourceName: string,
  title: string,
): string {
  const input = `${sourceType}\0${sourceName}\0${title}`;
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) & 0xffffffff;
  }
  return (hash >>> 0).toString(36);
}

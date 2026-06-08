import { storage } from '@/utils/jotai';
import { atomWithStorage } from 'jotai/utils';

/**
 * Whether the ON-DEVICE health source (Apple Health / Health Connect) is
 * connected. Cloud vendors (Whoop) are tracked server-side and read via
 * `useCloudConnections()` — see `../hooks/useHealthConnections`, which merges
 * this flag with cloud status into a per-provider map.
 */
export const hasConnectedHealthAtom = atomWithStorage<boolean>(
  'has-connected-health',
  false,
  storage,
);

/**
 * Whether the one-time "choose which source feeds each metric" prompt has been
 * shown (after a 2nd overlapping source connects). Persisted so it fires once.
 */
export const dataSourcePromptShownAtom = atomWithStorage<boolean>(
  'data-source-prompt-shown',
  false,
  storage,
);

/**
 * Whether a direct WHOOP connection is active (kept in sync by
 * `useCloudConnections`). Read by the iOS HealthKit readers to drop samples
 * WHOOP itself wrote into Apple Health — keeping the canonical cloud copy and
 * avoiding double-counting. Persisted so the background task can read it.
 */
export const whoopConnectedAtom = atomWithStorage<boolean>(
  'whoop-connected',
  false,
  storage,
);

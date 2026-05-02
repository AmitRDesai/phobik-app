import { useSession } from '@/lib/auth';
import * as SecureStore from 'expo-secure-store';
import { useMemo } from 'react';

type LiveReturn = ReturnType<typeof useSession>;
type SessionData = LiveReturn['data'];

const CACHE_KEY = 'phobik_auth_session_data';

function readCachedSession(): SessionData {
  try {
    const raw = SecureStore.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !('session' in parsed) ||
      !('user' in parsed)
    ) {
      return null;
    }
    return parsed as NonNullable<SessionData>;
  } catch {
    return null;
  }
}

export function useCachedSession(): LiveReturn {
  const live = useSession();

  return useMemo<LiveReturn>(() => {
    if (live.data) return live;
    // Only fall back to the cached session while the live session is still loading.
    // Once Better Auth has resolved (logout, 401, or genuine no-session), trust it.
    if (!live.isPending) return live;

    const cached = readCachedSession();
    if (cached) {
      return {
        ...live,
        data: cached,
        isPending: false,
      };
    }
    return live;
  }, [live]);
}

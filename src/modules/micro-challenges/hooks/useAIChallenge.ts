import { useEffect, useReducer, useRef } from 'react';
import { authClient } from '@/lib/auth';
import { env } from '@/utils/env';
import { getChallenge, type MicroChallengeResult } from '../data/challenges';

type CacheEntry = {
  emotionId: string;
  needId: string;
  challenge: MicroChallengeResult;
};

// Module-level cache — persists across re-renders and navigation
let cachedEntry: CacheEntry | null = null;

type UseAIChallengeOptions = {
  emotionId: string;
  needId: string;
};

/** Map flat AI response (doseDopamine etc.) to MicroChallengeResult with nested dose */
function mapAIResponse(
  data: Record<string, unknown>,
): MicroChallengeResult | null {
  if (!data.title || !data.challengeText) return null;
  return {
    title: data.title as string,
    prompt: (data.prompt as string) ?? '',
    challengeText: data.challengeText as string,
    dose: {
      dopamine: (data.doseDopamine as number) ?? 0,
      oxytocin: (data.doseOxytocin as number) ?? 0,
      serotonin: (data.doseSerotonin as number) ?? 0,
      endorphins: (data.doseEndorphins as number) ?? 0,
    },
  };
}

async function fetchAIChallenge(
  emotionId: string,
  needId: string,
): Promise<MicroChallengeResult | null> {
  // @ts-expect-error getCookie is added by the Expo plugin at runtime
  const cookies = authClient.getCookie() as string | undefined;
  const { fetch: expoFetch } = await import('expo/fetch');

  const res = await expoFetch(`${env.get('API_URL')}/api/coach/challenge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookies ? { Cookie: cookies } : {}),
    },
    body: JSON.stringify({ emotionId, needId }),
  });

  if (!res.ok) throw new Error('AI challenge request failed');
  const data = await res.json();
  return mapAIResponse(data);
}

type AIState = {
  challenge: MicroChallengeResult;
  isLoading: boolean;
  isAI: boolean;
};

type AIAction =
  | { type: 'FETCH_START'; fallback: MicroChallengeResult }
  | { type: 'FETCH_SUCCESS'; result: MicroChallengeResult }
  | { type: 'FETCH_DONE' };

function aiReducer(state: AIState, action: AIAction): AIState {
  switch (action.type) {
    case 'FETCH_START':
      return { challenge: action.fallback, isLoading: true, isAI: false };
    case 'FETCH_SUCCESS':
      return { challenge: action.result, isLoading: false, isAI: true };
    case 'FETCH_DONE':
      return { ...state, isLoading: false };
  }
}

export function useAIChallenge({ emotionId, needId }: UseAIChallengeOptions) {
  const cacheHit =
    cachedEntry?.emotionId === emotionId && cachedEntry?.needId === needId;

  const [{ challenge, isLoading, isAI }, dispatch] = useReducer(aiReducer, {
    challenge:
      cacheHit && cachedEntry
        ? cachedEntry.challenge
        : getChallenge(emotionId, needId),
    isLoading: !cacheHit,
    isAI: cacheHit,
  });
  const fetchedKeyRef = useRef(cacheHit ? `${emotionId}:${needId}` : '');

  useEffect(() => {
    const key = `${emotionId}:${needId}`;
    if (fetchedKeyRef.current === key) return;

    let cancelled = false;
    dispatch({
      type: 'FETCH_START',
      fallback: getChallenge(emotionId, needId),
    });

    (async () => {
      try {
        const result = await fetchAIChallenge(emotionId, needId);
        if (cancelled) return;

        if (result) {
          dispatch({ type: 'FETCH_SUCCESS', result });
          cachedEntry = { emotionId, needId, challenge: result };
        }
        fetchedKeyRef.current = key;
      } catch {
        fetchedKeyRef.current = key;
      } finally {
        if (!cancelled) dispatch({ type: 'FETCH_DONE' });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [emotionId, needId]);

  const regenerate = () => {
    cachedEntry = null;
    fetchedKeyRef.current = '';
    dispatch({
      type: 'FETCH_START',
      fallback: getChallenge(emotionId, needId),
    });

    (async () => {
      try {
        const result = await fetchAIChallenge(emotionId, needId);
        if (result) {
          dispatch({ type: 'FETCH_SUCCESS', result });
          cachedEntry = { emotionId, needId, challenge: result };
          fetchedKeyRef.current = `${emotionId}:${needId}`;
        }
      } catch {
        // Keep static fallback
      } finally {
        dispatch({ type: 'FETCH_DONE' });
      }
    })();
  };

  return { challenge, isLoading, isAI, regenerate };
}

/** Clear the cached challenge (call when the challenge flow is completed) */
export function clearChallengeCache() {
  cachedEntry = null;
}

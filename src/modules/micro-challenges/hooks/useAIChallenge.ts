import { useCallback, useEffect, useRef, useState } from 'react';
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

export function useAIChallenge({ emotionId, needId }: UseAIChallengeOptions) {
  const cacheHit =
    cachedEntry?.emotionId === emotionId && cachedEntry?.needId === needId;

  const [challenge, setChallenge] = useState<MicroChallengeResult>(
    cacheHit && cachedEntry
      ? cachedEntry.challenge
      : getChallenge(emotionId, needId),
  );
  const [isLoading, setIsLoading] = useState(!cacheHit);
  const [isAI, setIsAI] = useState(cacheHit);
  const fetchedKeyRef = useRef(cacheHit ? `${emotionId}:${needId}` : '');

  useEffect(() => {
    const key = `${emotionId}:${needId}`;
    if (fetchedKeyRef.current === key) return;

    let cancelled = false;
    setIsLoading(true);
    setIsAI(false);
    setChallenge(getChallenge(emotionId, needId));

    (async () => {
      try {
        const result = await fetchAIChallenge(emotionId, needId);
        if (cancelled) return;

        if (result) {
          setChallenge(result);
          setIsAI(true);
          cachedEntry = { emotionId, needId, challenge: result };
        }
        fetchedKeyRef.current = key;
      } catch {
        fetchedKeyRef.current = key;
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [emotionId, needId]);

  const regenerate = useCallback(() => {
    cachedEntry = null;
    fetchedKeyRef.current = '';
    setIsLoading(true);
    setIsAI(false);
    setChallenge(getChallenge(emotionId, needId));

    (async () => {
      try {
        const result = await fetchAIChallenge(emotionId, needId);
        if (result) {
          setChallenge(result);
          setIsAI(true);
          cachedEntry = { emotionId, needId, challenge: result };
          fetchedKeyRef.current = `${emotionId}:${needId}`;
        }
      } catch {
        // Keep static fallback
      } finally {
        setIsLoading(false);
      }
    })();
  }, [emotionId, needId]);

  return { challenge, isLoading, isAI, regenerate };
}

/** Clear the cached challenge (call when the challenge flow is completed) */
export function clearChallengeCache() {
  cachedEntry = null;
}

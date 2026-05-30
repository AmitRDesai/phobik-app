import { useKeepAwake } from 'expo-keep-awake';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

interface UseSessionTimerOptions {
  totalDuration: number;
  initialTimeRemaining?: number;
  isPaused: boolean;
  sessionReady: boolean;
  practiceType: string;
  onComplete: () => void;
}

export function useSessionTimer({
  totalDuration,
  initialTimeRemaining,
  isPaused,
  sessionReady,
  practiceType,
  onComplete,
}: UseSessionTimerOptions) {
  useKeepAwake();
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(
    initialTimeRemaining ?? totalDuration,
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasCompletedRef = useRef(false);

  // Keep the latest onComplete in a ref so the completion effect doesn't
  // depend on its (unstable, inline-arrow) identity to re-fire. Sync in an
  // effect (every commit) rather than during render to stay lint-clean.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const elapsed = totalDuration - timeRemaining;
  const progress = elapsed / totalDuration;

  // Complete session when timer reaches zero — exactly once, guarded against
  // re-renders that would otherwise re-fire onComplete + double-navigate.
  useEffect(() => {
    if (timeRemaining === 0 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onCompleteRef.current();
      router.replace({
        pathname: '/practices/completion',
        params: {
          practiceType,
          durationSeconds: String(totalDuration),
        },
      });
    }
  }, [timeRemaining, router, practiceType, totalDuration]);

  // Timer only runs after session is ready
  useEffect(() => {
    if (isPaused || !sessionReady) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, sessionReady]);

  return { timeRemaining, setTimeRemaining, elapsed, progress };
}

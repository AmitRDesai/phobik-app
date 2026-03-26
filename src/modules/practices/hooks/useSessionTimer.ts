import { useEffect, useRef, useState } from 'react';
import { useKeepAwake } from 'expo-keep-awake';
import { useRouter } from 'expo-router';

interface UseSessionTimerOptions {
  totalDuration: number;
  initialTimeRemaining?: number;
  isPaused: boolean;
  sessionReady: boolean;
  onComplete: () => void;
}

export function useSessionTimer({
  totalDuration,
  initialTimeRemaining,
  isPaused,
  sessionReady,
  onComplete,
}: UseSessionTimerOptions) {
  useKeepAwake();
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(
    initialTimeRemaining ?? totalDuration,
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const elapsed = totalDuration - timeRemaining;
  const progress = elapsed / totalDuration;

  // Complete session when timer reaches zero
  useEffect(() => {
    if (timeRemaining === 0) {
      onComplete();
      router.replace('/practices/completion');
    }
  }, [timeRemaining, onComplete, router]);

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

import { getDeviceId } from '@/lib/device-id';
import { getExpoPushToken } from '@/lib/notifications';
import { orpc } from '@/lib/orpc';
import { useUserId } from '@/lib/powersync/useUserId';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

/**
 * Registers the device's Expo push token with the backend.
 * Runs once per user session — re-runs when userId changes (sign in/out).
 * Token rotations between app launches are picked up on next app start.
 */
export function usePushTokenRegistration() {
  const userId = useUserId();
  const registeredForUser = useRef<string | null>(null);

  const { mutate } = useMutation(
    orpc.pushToken.registerToken.mutationOptions(),
  );

  useEffect(() => {
    if (!userId) {
      registeredForUser.current = null;
      return;
    }

    // Only register once per userId — prevents re-registration on re-renders
    if (registeredForUser.current === userId) return;
    registeredForUser.current = userId;

    let cancelled = false;

    (async () => {
      const token = await getExpoPushToken();
      if (!token || cancelled) return;

      const deviceId = await getDeviceId();

      mutate({
        token,
        deviceId,
        platform: Platform.OS as 'ios' | 'android',
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, mutate]);
}

import { authClient } from '@/lib/auth';
import { useCachedSession } from '@/hooks/useCachedSession';
import { getDeviceId } from '@/lib/device-id';
import { powersync } from '@/lib/powersync';
import { rpcClient } from '@/lib/rpc';
import { withTimeoutAndRetry } from '@/lib/server-warmup';
import { dialog } from '@/utils/dialog';
import { env } from '@/utils/env';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import {
  biometricEnabledAtom,
  biometricPromptShownAtom,
  isSignedOutAtom,
} from '@/store/auth';

const SLOW_RESPONSE_THRESHOLD_MS = 3_000;

/**
 * Tracks whether a mutation has been pending long enough that we should
 * surface a "still working" hint to the user — typical staging cold-start
 * is 11–13s, so silent waits feel broken.
 */
function useSlowResponseFlag(isPending: boolean): boolean {
  const [slow, setSlow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (isPending) {
      setSlow(false);
      timerRef.current = setTimeout(
        () => setSlow(true),
        SLOW_RESPONSE_THRESHOLD_MS,
      );
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setSlow(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPending]);

  return slow;
}

/**
 * Hook to get the current session
 * Returns session data, loading state, and error
 */
export function useSession() {
  return useCachedSession();
}

/**
 * Hook for email/password sign in
 */
export function useSignIn() {
  const setIsSignedOut = useSetAtom(isSignedOutAtom);

  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const result = await withTimeoutAndRetry(() =>
        authClient.signIn.email({ email, password }),
      );

      if (result.error) {
        throw new Error(result.error.message || 'Sign in failed');
      }

      return result.data;
    },
    onSuccess: () => {
      setIsSignedOut(false);
    },
  });

  const slowResponse = useSlowResponseFlag(mutation.isPending);
  return { ...mutation, slowResponse };
}

/**
 * Hook for email/password sign up
 */
export function useSignUp() {
  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      const result = await withTimeoutAndRetry(() =>
        authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: `${env.get('APP_SCHEME')}://email-verification`,
        }),
      );

      if (result.error) {
        throw new Error(result.error.message || 'Sign up failed');
      }

      return result.data;
    },
  });

  const slowResponse = useSlowResponseFlag(mutation.isPending);
  return { ...mutation, slowResponse };
}

/**
 * Hook for sign out
 * Supports soft sign-out (keeps session) when biometric is enabled
 */
export function useSignOut() {
  const queryClient = useQueryClient();
  const biometricEnabled = useAtomValue(biometricEnabledAtom);
  const setIsSignedOut = useSetAtom(isSignedOutAtom);
  const setBiometricEnabled = useSetAtom(biometricEnabledAtom);
  const setBiometricPromptShown = useSetAtom(biometricPromptShownAtom);

  return useMutation({
    mutationFn: async ({ force = false }: { force?: boolean } = {}) => {
      // Sign-out triggers `disconnectAndClear()` on PowerSync, which wipes the
      // local SQLite DB — including any pending writes that haven't uploaded.
      // If the queue is non-empty, confirm with the user before proceeding.
      let hasPending = false;
      try {
        hasPending = (await powersync.getCrudBatch(1)) !== null;
      } catch {
        // PowerSync not initialized — safe to proceed
      }
      if (hasPending) {
        const result = await dialog.error({
          title: 'Unsynced Changes',
          message:
            "You have changes that haven't been saved to the cloud yet. Signing out now will permanently delete them.",
          buttons: [
            {
              label: 'Sign Out Anyway',
              value: 'confirm',
              variant: 'destructive',
            },
            { label: 'Cancel', value: 'cancel', variant: 'secondary' },
          ],
        });
        if (result !== 'confirm') return;
      }

      if (biometricEnabled && !force) {
        // Soft sign-out: keep session, just set flag
        setIsSignedOut(true);
      } else {
        // Unregister push token before destroying session
        try {
          const deviceId = await getDeviceId();
          await rpcClient.pushToken.unregisterToken({ deviceId });
        } catch {
          // Best-effort: don't block sign-out if this fails
        }

        // Full sign-out: destroy session, reset biometric so it's offered again
        await authClient.signOut();
        setIsSignedOut(false);
        setBiometricEnabled(false);
        setBiometricPromptShown(false);
        queryClient.clear();
      }
    },
  });
}

/**
 * Hook for native Apple Sign-In using expo-apple-authentication.
 * Uses the native iOS sheet and sends the idToken to Better Auth.
 */
export function useAppleSignIn() {
  const setIsSignedOut = useSetAtom(isSignedOutAtom);

  return useMutation({
    mutationFn: async () => {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('No identity token received from Apple');
      }

      const result = await authClient.signIn.social({
        provider: 'apple',
        idToken: {
          token: credential.identityToken,
        },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Apple sign in failed');
      }

      return result.data;
    },
    onSuccess: () => {
      setIsSignedOut(false);
    },
  });
}

/**
 * Hook for web-based social sign in (Google)
 */
export function useGoogleSignIn() {
  const setIsSignedOut = useSetAtom(isSignedOutAtom);

  return useMutation({
    mutationFn: async () => {
      const result = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });

      if (result.error) {
        throw new Error(result.error.message || 'Google sign in failed');
      }

      return result.data;
    },
    onSuccess: () => {
      setIsSignedOut(false);
    },
  });
}

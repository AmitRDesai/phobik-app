import { authClient, useSession as useBetterAuthSession } from '@/lib/auth';
import { getDeviceId } from '@/lib/device-id';
import { rpcClient } from '@/lib/rpc';
import { env } from '@/utils/env';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  biometricEnabledAtom,
  biometricPromptShownAtom,
  isSignedOutAtom,
} from '../store/biometric';

/**
 * Hook to get the current session
 * Returns session data, loading state, and error
 */
export function useSession() {
  return useBetterAuthSession();
}

/**
 * Hook for email/password sign in
 */
export function useSignIn() {
  const setIsSignedOut = useSetAtom(isSignedOutAtom);

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Sign in failed');
      }

      return result.data;
    },
    onSuccess: () => {
      setIsSignedOut(false);
    },
  });
}

/**
 * Hook for email/password sign up
 */
export function useSignUp() {
  return useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: `${env.get('APP_SCHEME')}://email-verification`,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Sign up failed');
      }

      return result.data;
    },
  });
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

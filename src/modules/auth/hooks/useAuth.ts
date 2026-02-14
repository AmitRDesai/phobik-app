import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient, useSession as useBetterAuthSession } from '@/lib/auth';
import { router } from 'expo-router';

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
  const queryClient = useQueryClient();

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
      // Invalidate session queries to refresh auth state
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
}

/**
 * Hook for email/password sign up
 */
export function useSignUp() {
  const queryClient = useQueryClient();

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
      });

      if (result.error) {
        throw new Error(result.error.message || 'Sign up failed');
      }

      return result.data;
    },
    onSuccess: () => {
      // Invalidate session queries to refresh auth state
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
}

/**
 * Hook for sign out
 */
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authClient.signOut();
    },
    onSuccess: () => {
      // Clear all queries and reset auth state
      queryClient.clear();
      router.replace('/auth/sign-in');
    },
  });
}

/**
 * Hook for social sign in (Google, Apple)
 */
export function useSocialSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ provider }: { provider: 'google' | 'apple' }) => {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: '/',
      });

      if (result.error) {
        throw new Error(result.error.message || 'Social sign in failed');
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
}

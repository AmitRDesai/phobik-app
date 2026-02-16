import { authClient, getSession } from '@/lib/auth';
import {
  biometricEnabledAtom,
  biometricPromptShownAtom,
  isSignedOutAtom,
} from '@/modules/auth/store/biometric';
import { store } from '@/utils/jotai';
import { queryClient } from './query-client';

class Session {
  /**
   * Get the current session from Better Auth
   * Better Auth handles token refresh automatically
   */
  getSession = async () => {
    const result = await getSession();
    return result.data;
  };

  /**
   * Check if user is authenticated
   */
  isAuthenticated = async () => {
    const session = await this.getSession();
    return !!session?.session;
  };

  /**
   * Clear the session (sign out)
   * If soft = true (biometric enabled), only set isSignedOut flag
   * If soft = false (default), destroy the session entirely
   */
  clear = async (soft = false) => {
    if (soft) {
      store.set(isSignedOutAtom, true);
    } else {
      await authClient.signOut();
      store.set(isSignedOutAtom, false);
      store.set(biometricEnabledAtom, false);
      store.set(biometricPromptShownAtom, false);
      queryClient.clear();
    }
  };
}

const session = new Session();

export default session;

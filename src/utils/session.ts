import { authClient, getSession } from '@/lib/auth';
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
   */
  clear = async () => {
    await authClient.signOut();
    queryClient.clear();
  };
}

const session = new Session();

export default session;

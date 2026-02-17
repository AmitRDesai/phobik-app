import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';
import { env } from '@/utils/env';

export const authClient = createAuthClient({
  baseURL: env.get('API_URL'),
  plugins: [
    expoClient({
      scheme: env.get('APP_SCHEME'),
      storagePrefix: 'phobik_auth',
      storage: SecureStore,
    }),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  listSessions,
  revokeSession,
  revokeSessions,
} = authClient;

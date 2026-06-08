import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { rpcClient } from '@/lib/rpc';

export type WhoopConnectResult = 'connected' | 'error' | 'cancelled';

/**
 * Connect WHOOP via backend-mediated OAuth. We fetch a signed auth URL from the
 * backend (authenticated oRPC call — its session rides the oRPC cookie, not the
 * in-app browser), open it in a web-auth session, and read the status the
 * backend deep-links back with. No client_secret or tokens ever touch the
 * device; the backend stores them encrypted and Whoop data syncs down via
 * PowerSync.
 */
export async function connectWhoop(): Promise<WhoopConnectResult> {
  const returnUrl = Linking.createURL('whoop/callback'); // phobik(.dev)://whoop/callback
  const { authUrl } = await rpcClient.health.startConnect({
    provider: 'whoop',
    returnUrl,
  });

  const result = await WebBrowser.openAuthSessionAsync(authUrl, returnUrl);
  if (result.type !== 'success') return 'cancelled';

  const status = Linking.parse(result.url).queryParams?.status;
  return status === 'connected' ? 'connected' : 'error';
}

/** Revoke at WHOOP + delete the server-side connection. */
export async function disconnectWhoop(): Promise<void> {
  await rpcClient.health.disconnect({ provider: 'whoop' });
}

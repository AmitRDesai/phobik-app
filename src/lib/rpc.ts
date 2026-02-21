import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { AppRouterClient } from '@backend/rpc';
import { env } from '@/utils/env';
import { authClient } from './auth';

const link = new RPCLink({
  url: `${env.get('API_URL')}/rpc`,
  headers: () => {
    const cookies = authClient.getCookie();
    return cookies ? { Cookie: cookies } : {};
  },
  async fetch(request, init) {
    const { fetch } = await import('expo/fetch');
    return fetch(request.url, {
      body: await request.blob(),
      headers: request.headers,
      method: request.method,
      signal: request.signal,
      ...init,
      credentials: 'omit',
    });
  },
});

export const rpcClient = createORPCClient<AppRouterClient>(link);

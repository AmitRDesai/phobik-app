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
  fetch: (request, init) => {
    return globalThis.fetch(request, {
      ...init,
      credentials: 'omit',
    });
  },
});

export const rpcClient = createORPCClient<AppRouterClient>(link);

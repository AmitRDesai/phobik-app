import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { AppRouterClient } from '@backend/rpc';
import { env } from '@/utils/env';

const link = new RPCLink({
  url: `${env.get('API_URL')}/rpc`,
  // Better Auth's expoClient plugin handles cookies automatically via SecureStore
  // The fetch credentials: 'include' will send cookies with requests
  fetch: (request, init) => {
    return globalThis.fetch(request, {
      ...init,
      credentials: 'include',
    });
  },
});

export const rpcClient = createORPCClient<AppRouterClient>(link);

import { rpcClient } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';

/**
 * Credit cost-per-generation + purchasable packs — the server is the single
 * source of truth. Online-only; cached for an hour (it rarely changes).
 */
export function useCreditConfig() {
  return useQuery({
    queryKey: ['credits-config'],
    queryFn: async () => rpcClient.credits.getConfig(),
    staleTime: 60 * 60 * 1000,
  });
}

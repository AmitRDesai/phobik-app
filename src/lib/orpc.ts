import { createORPCReactQueryUtils } from '@orpc/react-query';
import { rpcClient } from './rpc';

/**
 * TanStack Query utilities for oRPC
 *
 * Usage:
 * ```ts
 * import { useQuery } from "@tanstack/react-query";
 * import { orpc } from "@/lib/orpc";
 *
 * // In a component:
 * const { data } = useQuery(orpc.auth.getSession.queryOptions());
 * ```
 *
 * Note: For full type safety, the rpcClient should be typed with AppRouter
 * from a shared types package.
 */
export const orpc = createORPCReactQueryUtils(rpcClient);

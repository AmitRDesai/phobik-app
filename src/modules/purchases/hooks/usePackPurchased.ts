import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMemo } from 'react';

/** Check if a single pack is purchased (offline-safe, reactive) */
export function usePackPurchased(packId: string): boolean {
  const userId = useUserId();

  const { data } = useQuery({
    queryKey: ['pack-purchase', userId, packId],
    query: db
      .selectFrom('pack_purchase')
      .select('id')
      .where('user_id', '=', userId ?? '')
      .where('pack_id', '=', packId)
      .limit(1),
    enabled: !!userId,
  });

  return (data?.length ?? 0) > 0;
}

/** Get a Set of all purchased pack IDs for the current user (offline-safe, reactive) */
export function usePackPurchases(): Set<string> {
  const userId = useUserId();

  const { data } = useQuery({
    queryKey: ['pack-purchases', userId],
    query: db
      .selectFrom('pack_purchase')
      .select('pack_id')
      .where('user_id', '=', userId ?? ''),
    enabled: !!userId,
  });

  return useMemo(
    () =>
      new Set(
        data?.map((r) => r.pack_id).filter((id): id is string => !!id) ?? [],
      ),
    [data],
  );
}

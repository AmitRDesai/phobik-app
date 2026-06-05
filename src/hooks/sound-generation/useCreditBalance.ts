import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useQuery } from '@powersync/tanstack-react-query';

/**
 * Reactive, offline-first credit balance. The wallet is server-authoritative
 * and synced down read-only — this just reflects the latest synced value
 * (0 if the user has never had a wallet row).
 */
export function useCreditBalance() {
  const userId = useUserId();

  const { data, isLoading } = useQuery({
    queryKey: ['credit-wallet', userId],
    query: db
      .selectFrom('credit_wallet')
      .select('balance')
      .where('user_id', '=', userId ?? ''),
    enabled: !!userId,
  });

  const balance = data?.[0]?.balance ?? 0;
  return { balance, isLoading };
}

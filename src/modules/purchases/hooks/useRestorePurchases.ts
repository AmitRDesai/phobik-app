import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useMutation } from '@tanstack/react-query';
import Purchases from 'react-native-purchases';
import { PACK_ENTITLEMENTS } from '../lib/product-map';

// Reverse lookup: entitlement ID → pack ID
const ENTITLEMENT_TO_PACK = Object.fromEntries(
  Object.entries(PACK_ENTITLEMENTS).map(([packId, entId]) => [entId, packId]),
);

export function useRestorePurchases() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Not authenticated');

      // 1. Restore via RevenueCat (may trigger OS auth prompt)
      const customerInfo = await Purchases.restorePurchases();

      // 2. For each active entitlement, ensure a local pack_purchase row exists.
      // Run all checks and inserts concurrently — each operates on a distinct packId.
      const restoredFlags = await Promise.all(
        Object.entries(customerInfo.entitlements.active).map(
          async ([entitlementId, entitlement]) => {
            const packId = ENTITLEMENT_TO_PACK[entitlementId];
            if (!packId) return false;

            // Check if already recorded locally
            const existing = await db
              .selectFrom('pack_purchase')
              .select('id')
              .where('user_id', '=', userId)
              .where('pack_id', '=', packId)
              .executeTakeFirst();

            if (!existing) {
              const now = new Date().toISOString();
              await db
                .insertInto('pack_purchase')
                .values({
                  id: uuid(),
                  user_id: userId,
                  pack_id: packId,
                  product_id: entitlement.productIdentifier,
                  purchased_at: entitlement.originalPurchaseDate ?? now,
                  created_at: now,
                  updated_at: now,
                })
                .execute();
              return true;
            }
            return false;
          },
        ),
      );

      const restoredCount = restoredFlags.filter(Boolean).length;

      return { restoredCount };
    },
  });
}

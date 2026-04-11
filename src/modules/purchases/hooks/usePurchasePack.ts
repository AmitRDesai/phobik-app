import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useMutation } from '@tanstack/react-query';
import Purchases from 'react-native-purchases';
import { PACK_ENTITLEMENTS, PACK_OFFERINGS } from '../lib/product-map';

export function usePurchasePack() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (packId: string) => {
      if (!userId) throw new Error('Not authenticated');

      const offeringId = PACK_OFFERINGS[packId];
      if (!offeringId) throw new Error(`Unknown pack: ${packId}`);

      const entitlementId = PACK_ENTITLEMENTS[packId];

      // 1. Fetch offerings from RevenueCat and find by offering ID
      const offerings = await Purchases.getOfferings();
      const offering = offerings.all[offeringId];

      if (!offering || offering.availablePackages.length === 0) {
        throw new Error(
          `Offering "${offeringId}" not found or has no packages in RevenueCat`,
        );
      }

      // Use the first available package in the offering
      const pkg = offering.availablePackages[0]!;

      // 2. Initiate purchase — RevenueCat handles store UI + receipt validation
      const { customerInfo } = await Purchases.purchasePackage(pkg);

      // 3. Verify purchase succeeded — check entitlement or any active entitlement
      const activeEntitlements = Object.keys(customerInfo.entitlements.active);

      if (__DEV__) {
        console.log(
          '[Purchase] Active entitlements:',
          activeEntitlements,
          'Expected:',
          entitlementId,
        );
      }

      const hasEntitlement = entitlementId
        ? typeof customerInfo.entitlements.active[entitlementId] !== 'undefined'
        : activeEntitlements.length > 0;

      if (!hasEntitlement) {
        throw new Error('Purchase could not be verified');
      }

      // 4. Record in local PowerSync DB (syncs to backend automatically)
      const now = new Date().toISOString();
      await db
        .insertInto('pack_purchase')
        .values({
          id: uuid(),
          user_id: userId,
          pack_id: packId,
          product_id: pkg.product.identifier,
          purchased_at: now,
          created_at: now,
          updated_at: now,
        })
        .execute();
    },
  });
}

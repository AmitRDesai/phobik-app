import { useMutation } from '@tanstack/react-query';
import Purchases, {
  PRODUCT_CATEGORY,
  type PurchasesPackage,
  type PurchasesStoreProduct,
} from 'react-native-purchases';
import { CREDITS_OFFERING_ID } from '../lib/product-map';

interface PurchaseCreditsInput {
  /** Internal pack id (for logging). */
  packId: string;
  /** Store product identifiers (iOS + Android) for this pack. */
  productIds: string[];
}

/**
 * Purchase a consumable credit pack. Credits are NOT granted here — the
 * RevenueCat webhook grants them server-side and the balance syncs down via
 * PowerSync. We only kick off the store purchase and report cancel vs success.
 * Consumables are not entitlements, so we never inspect `customerInfo`.
 */
export function usePurchaseCredits() {
  return useMutation({
    mutationFn: async (
      input: PurchaseCreditsInput,
    ): Promise<{ cancelled: boolean }> => {
      // Prefer the configured "credits" offering; fall back to a direct
      // non-subscription product fetch if the offering isn't set up.
      let pkg: PurchasesPackage | null = null;
      let product: PurchasesStoreProduct | null = null;

      const offerings = await Purchases.getOfferings();
      const offering = offerings.all[CREDITS_OFFERING_ID];
      if (offering) {
        pkg =
          offering.availablePackages.find((p) =>
            input.productIds.includes(p.product.identifier),
          ) ?? null;
      }
      if (!pkg) {
        const products = await Purchases.getProducts(
          input.productIds,
          PRODUCT_CATEGORY.NON_SUBSCRIPTION,
        );
        product = products[0] ?? null;
      }
      if (!pkg && !product) {
        throw new Error('This credit pack is not available in the store yet.');
      }

      try {
        if (pkg) await Purchases.purchasePackage(pkg);
        else if (product) await Purchases.purchaseStoreProduct(product);
      } catch (e) {
        const err = e as { userCancelled?: boolean };
        if (err.userCancelled) return { cancelled: true };
        throw e;
      }

      return { cancelled: false };
    },
  });
}

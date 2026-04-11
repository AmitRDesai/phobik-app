import { useQuery } from '@tanstack/react-query';
import Purchases, { type PurchasesStoreProduct } from 'react-native-purchases';
import { PACK_OFFERINGS } from '../lib/product-map';

/** Fetch the RevenueCat store product for a pack (price, currency, etc.) */
export function usePackOffering(packId: string) {
  const offeringId = PACK_OFFERINGS[packId];

  return useQuery({
    queryKey: ['pack-offering', packId],
    queryFn: async (): Promise<PurchasesStoreProduct | null> => {
      if (!offeringId) return null;

      const offerings = await Purchases.getOfferings();
      const offering = offerings.all[offeringId];
      const pkg = offering?.availablePackages[0];
      return pkg?.product ?? null;
    },
    staleTime: 1000 * 60 * 30, // 30 min — product info rarely changes
    enabled: !!offeringId,
  });
}

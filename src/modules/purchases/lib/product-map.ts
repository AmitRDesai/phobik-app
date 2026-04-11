/**
 * Maps pack IDs (from specialized-packs.ts) to RevenueCat offering identifiers.
 * Offerings must be configured in the RevenueCat dashboard and linked to
 * App Store Connect / Google Play Console products.
 */
export const PACK_OFFERINGS: Record<string, string> = {
  'fear-of-flying': 'phobik_fear_of_flying',
};

/**
 * Maps pack IDs to RevenueCat entitlement identifiers.
 * By convention, entitlement IDs match pack IDs.
 */
export const PACK_ENTITLEMENTS: Record<string, string> = {
  'fear-of-flying': 'fear-of-flying',
};

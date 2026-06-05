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

/**
 * RevenueCat offering that groups the consumable credit packs. The consumable
 * products (phobik_credits_10/50/250) must be added to this offering in the
 * RevenueCat dashboard. Credits are granted server-side via the RC webhook —
 * not via entitlements (consumables aren't entitlements).
 */
export const CREDITS_OFFERING_ID = 'phobik_credits';

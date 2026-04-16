import { env } from '@/utils/env';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

let initialized = false;

export async function initRevenueCat() {
  if (initialized) return;

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  }

  const apiKey =
    Platform.OS === 'ios'
      ? env.get('REVENUECAT_IOS_API_KEY')
      : env.get('REVENUECAT_ANDROID_API_KEY');

  if (!apiKey) {
    console.warn('[RevenueCat] No API key configured — skipping init');
    return;
  }

  Purchases.configure({ apiKey });
  initialized = true;
}

export async function identifyUser(userId: string) {
  if (!initialized) return;
  await Purchases.logIn(userId);
}

export async function logOutRevenueCat() {
  if (!initialized) return;
  if (await Purchases.isAnonymous()) return;
  await Purchases.logOut();
}

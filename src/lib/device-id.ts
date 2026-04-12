import * as SecureStore from 'expo-secure-store';
import { uuid } from './crypto';

const DEVICE_ID_KEY = 'phobik_device_id';

let cachedDeviceId: string | null = null;

/**
 * Get or create a stable unique device identifier.
 * Persisted in SecureStore — survives app updates, regenerates on reinstall.
 */
export async function getDeviceId(): Promise<string> {
  if (cachedDeviceId) return cachedDeviceId;

  let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = uuid();
    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
  }

  cachedDeviceId = deviceId;
  return deviceId;
}

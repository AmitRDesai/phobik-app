import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'jotai/utils';
import { getDefaultStore } from 'jotai/vanilla';
import { Platform } from 'react-native';

// SSR-safe storage for Jotai
const getStorage = () => {
  // Check if we're in SSR (Node.js environment)
  if (Platform.OS === 'web' && typeof window === 'undefined') {
    // Return a no-op storage for SSR
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }
  return AsyncStorage;
};

export const storage = createJSONStorage<any>(getStorage);
export const store = getDefaultStore();

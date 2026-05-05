import { atomWithStorage } from 'jotai/utils';
import { storage } from '@/utils/jotai';

export const biometricEnabledAtom = atomWithStorage<boolean>(
  'biometric-enabled',
  false,
  storage,
);

export const biometricPromptShownAtom = atomWithStorage<boolean>(
  'biometric-prompt-shown',
  false,
  storage,
);

export const isSignedOutAtom = atomWithStorage<boolean>(
  'is-signed-out',
  false,
  storage,
);

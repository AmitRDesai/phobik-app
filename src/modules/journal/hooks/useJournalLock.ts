import {
  useBiometricAuth,
  useBiometricAvailability,
} from '@/hooks/auth/useBiometric';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { journalUnlockedAtom } from '../store/journal';

export function useJournalLock() {
  const { isAvailable, biometricType } = useBiometricAvailability();
  const { authenticate } = useBiometricAuth();
  const [isUnlocked, setUnlocked] = useAtom(journalUnlockedAtom);
  const appState = useRef(AppState.currentState);

  // Auto-lock when app goes to background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (
        appState.current === 'active' &&
        nextState.match(/inactive|background/)
      ) {
        setUnlocked(false);
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [setUnlocked]);

  const unlock = useCallback(async () => {
    const result = await authenticate('Unlock your journal');
    if (result.success) {
      setUnlocked(true);
      return true;
    }
    return false;
  }, [authenticate, setUnlocked]);

  const lock = useCallback(() => {
    setUnlocked(false);
  }, [setUnlocked]);

  const biometricIcon =
    biometricType === 'Face ID' ? ('scan' as const) : ('finger-print' as const);

  return {
    isLocked: !isUnlocked,
    isAvailable,
    biometricType,
    biometricIcon,
    unlock,
    lock,
  };
}

import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useState } from 'react';

type BiometricType = 'Face ID' | 'Touch ID' | 'Biometric';

export function useBiometricAvailability() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricType, setBiometricType] =
    useState<BiometricType>('Biometric');

  useEffect(() => {
    async function check() {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        setIsAvailable(true);
        const types =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (
          types.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
          )
        ) {
          setBiometricType('Face ID');
        } else if (
          types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        ) {
          setBiometricType('Touch ID');
        }
      }
    }

    check();
  }, []);

  return { isAvailable, biometricType };
}

export function useBiometricAuth() {
  const authenticate = useCallback(
    async (promptMessage = 'Authenticate to sign in') => {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });
      return result;
    },
    [],
  );

  return { authenticate };
}

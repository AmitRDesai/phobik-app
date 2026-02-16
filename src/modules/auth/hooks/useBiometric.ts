import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

type BiometricType = 'Face ID' | 'Touch ID' | 'Fingerprint' | 'Biometric';

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
        const hasFace = types.includes(
          LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
        );
        const hasFingerprint = types.includes(
          LocalAuthentication.AuthenticationType.FINGERPRINT,
        );

        if (Platform.OS === 'ios') {
          setBiometricType(hasFace ? 'Face ID' : 'Touch ID');
        } else {
          setBiometricType(hasFingerprint ? 'Fingerprint' : 'Biometric');
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

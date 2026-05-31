import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

type BiometricType = 'Face ID' | 'Touch ID' | 'Fingerprint' | 'Biometric';

export function useBiometricAvailability() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricType, setBiometricType] =
    useState<BiometricType>('Biometric');
  // `resolved` flips true once the async native check settles (success OR
  // failure). Callers gate routing on it so a fresh biometric-capable user
  // isn't routed past biometric-setup before availability is known.
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!mounted) return;

        if (hasHardware && isEnrolled) {
          setIsAvailable(true);
          const types =
            await LocalAuthentication.supportedAuthenticationTypesAsync();
          if (!mounted) return;
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
      } finally {
        // Always settle so the routing gate can never deadlock, even if the
        // native check throws.
        if (mounted) setResolved(true);
      }
    }

    check();

    return () => {
      mounted = false;
    };
  }, []);

  return { isAvailable, biometricType, resolved };
}

export function useBiometricAuth() {
  const authenticate = async (promptMessage = 'Authenticate to sign in') => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });
    return result;
  };

  return { authenticate };
}

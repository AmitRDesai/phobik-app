import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSetAtom } from 'jotai';
import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useBiometricAuth,
  useBiometricAvailability,
} from '../hooks/useBiometric';
import {
  biometricEnabledAtom,
  biometricPromptShownAtom,
} from '../store/biometric';

interface BiometricSetupProps {
  mode: 'onboarding' | 'settings';
}

export function BiometricSetup({ mode }: BiometricSetupProps) {
  const { biometricType } = useBiometricAvailability();
  const { authenticate } = useBiometricAuth();
  const setBiometricEnabled = useSetAtom(biometricEnabledAtom);
  const setBiometricPromptShown = useSetAtom(biometricPromptShownAtom);

  const iconName = biometricType === 'Face ID' ? 'scan' : 'finger-print';

  const handleEnable = async () => {
    const result = await authenticate(
      `Verify ${biometricType} to enable quick sign-in`,
    );

    if (result.success) {
      setBiometricEnabled(true);
      setBiometricPromptShown(true);
      if (mode === 'onboarding') {
        router.replace('/');
      }
    } else if (result.error !== 'user_cancel') {
      Alert.alert(
        `${biometricType} Failed`,
        'Please try again or skip for now.',
      );
    }
  };

  const handleSkip = () => {
    setBiometricPromptShown(true);
    router.replace('/');
  };

  if (mode === 'settings') {
    return (
      <View className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary-pink/20">
              <Ionicons name={iconName} size={22} color={colors.primary.pink} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-white">
                {biometricType}
              </Text>
              <Text className="text-sm text-white/50">
                Quick sign-in with {biometricType}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={handleEnable}
            className="rounded-full bg-primary-pink/20 px-4 py-2"
          >
            <Text className="text-sm font-semibold text-primary-pink">
              Enable
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-background-dark"
      edges={['top', 'bottom']}
    >
      <View className="flex-1 items-center justify-center px-8">
        {/* Icon */}
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
            shadowColor: colors.primary.pink,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
          }}
        >
          <Ionicons name={iconName} size={56} color="white" />
        </LinearGradient>

        <Text className="text-center text-3xl font-extrabold text-white">
          Enable {biometricType}
        </Text>
        <Text className="mt-3 text-center text-base leading-relaxed text-white/50">
          Use {biometricType} to quickly sign back in without typing your
          password.
        </Text>

        <View className="mt-10 w-full gap-3">
          <GradientButton onPress={handleEnable}>
            Enable {biometricType}
          </GradientButton>

          <Pressable onPress={handleSkip} className="py-4">
            <Text className="text-center text-base font-semibold text-white/40">
              Skip for now
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import {
  useBiometricAuth,
  useBiometricAvailability,
} from '@/hooks/auth/useBiometric';
import { biometricEnabledAtom, biometricPromptShownAtom } from '@/store/auth';
import { dialog } from '@/utils/dialog';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSetAtom } from 'jotai';
import { Pressable, Text, View } from 'react-native';

interface BiometricSetupProps {
  mode: 'initial-setup' | 'settings';
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
    } else if (result.error !== 'user_cancel') {
      dialog.error({
        title: `${biometricType} Failed`,
        message: 'Please try again or skip for now.',
      });
    }
  };

  const handleSkip = () => {
    setBiometricPromptShown(true);
  };

  if (mode === 'settings') {
    return (
      <Card className="p-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-3">
            <IconChip size="md" shape="rounded" tone="pink">
              <Ionicons name={iconName} size={22} color={colors.primary.pink} />
            </IconChip>
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground">
                {biometricType}
              </Text>
              <Text className="text-sm text-foreground/55">
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
      </Card>
    );
  }

  return (
    <Screen variant="auth" className="flex-1 items-center justify-center px-8">
      <View className="w-full items-center">
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
            boxShadow: `0 8px 20px ${withAlpha(colors.primary.pink, 0.3)}`,
          }}
        >
          <Ionicons name={iconName} size={56} color="white" />
        </LinearGradient>

        <Text className="text-center text-3xl font-extrabold text-foreground">
          Enable {biometricType}
        </Text>
        <Text className="mt-3 text-center text-base leading-relaxed text-foreground/55">
          Use {biometricType} to quickly sign back in without typing your
          password.
        </Text>

        <View className="mt-10 w-full gap-3">
          <GradientButton onPress={handleEnable}>
            Enable {biometricType}
          </GradientButton>
          <Pressable onPress={handleSkip} className="py-4">
            <Text className="text-center text-base font-semibold text-foreground/55">
              Skip for now
            </Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

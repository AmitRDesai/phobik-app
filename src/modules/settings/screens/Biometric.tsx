import { BackButton } from '@/components/ui/BackButton';
import { Screen } from '@/components/ui/Screen';
import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { BiometricSetup } from '@/modules/auth/components/BiometricSetup';
import { useSignOut } from '@/hooks/auth/useAuth';
import { useBiometricAvailability } from '@/hooks/auth/useBiometric';
import { biometricEnabledAtom } from '@/store/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { Pressable, Switch, Text, View } from 'react-native';

export default function Biometric() {
  const { biometricType, isAvailable } = useBiometricAvailability();
  const [biometricEnabled, setBiometricEnabled] = useAtom(biometricEnabledAtom);
  const signOut = useSignOut();
  const scheme = useScheme();

  const handleDisable = () => {
    setBiometricEnabled(false);
  };

  const handleLockApp = async () => {
    await signOut.mutateAsync();
  };

  return (
    <Screen
      variant="default"
      scroll
      header={
        <View className="flex-row items-center gap-3 px-4 py-2">
          <BackButton />
          <Text className="text-lg font-bold text-foreground">
            Biometric Login
          </Text>
        </View>
      }
      className="px-4"
      contentClassName="gap-4"
    >
      {!isAvailable ? (
        <View className="rounded-2xl border border-foreground/10 bg-foreground/5 p-6">
          <Text className="text-center text-base text-foreground/50">
            Biometric authentication is not available on this device.
          </Text>
        </View>
      ) : biometricEnabled ? (
        <>
          <View className="rounded-2xl border border-foreground/10 bg-foreground/5 p-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-status-success/20">
                  <MaterialIcons
                    name="check-circle"
                    size={22}
                    color={colors.status.success}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    {biometricType} Enabled
                  </Text>
                  <Text className="text-sm text-foreground/50">
                    Quick sign-in is active
                  </Text>
                </View>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={(val) => {
                  if (!val) handleDisable();
                }}
                trackColor={{
                  false: foregroundFor(scheme, 0.1),
                  true: colors.primary.pink,
                }}
                thumbColor="white"
              />
            </View>
          </View>

          <Pressable
            onPress={handleLockApp}
            className="flex-row items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-foreground/5 py-4 active:opacity-70"
          >
            <MaterialIcons name="lock" size={20} color={colors.primary.pink} />
            <Text className="text-base font-semibold text-primary-pink">
              Lock App
            </Text>
          </Pressable>
          <Text className="px-2 text-center text-xs text-foreground/40">
            Locks the app and requires {biometricType} to re-enter. Your session
            stays active.
          </Text>
        </>
      ) : (
        <BiometricSetup mode="settings" />
      )}
    </Screen>
  );
}

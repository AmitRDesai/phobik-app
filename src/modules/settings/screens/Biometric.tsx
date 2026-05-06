import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { BiometricSetup } from '@/modules/auth/components/BiometricSetup';
import { useSignOut } from '@/hooks/auth/useAuth';
import { useBiometricAvailability } from '@/hooks/auth/useBiometric';
import { biometricEnabledAtom } from '@/store/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { Text } from '@/components/themed/Text';
import { Pressable, Switch, View } from 'react-native';
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
      header={<Header title="Biometric Login" />}
      className="px-4"
      contentClassName="gap-4"
    >
      {!isAvailable ? (
        <Card className="p-6">
          <Text className="text-center text-base text-foreground/50">
            Biometric authentication is not available on this device.
          </Text>
        </Card>
      ) : biometricEnabled ? (
        <>
          <Card className="p-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center gap-3">
                <IconChip
                  size="md"
                  shape="rounded"
                  bg={withAlpha(colors.status.success, 0.2)}
                >
                  <MaterialIcons
                    name="check-circle"
                    size={22}
                    color={colors.status.success}
                  />
                </IconChip>
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
          </Card>

          <Card
            onPress={handleLockApp}
            className="flex-row items-center justify-center gap-2 py-4"
          >
            <MaterialIcons name="lock" size={20} color={colors.primary.pink} />
            <Text className="text-base font-semibold text-primary-pink">
              Lock App
            </Text>
          </Card>
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

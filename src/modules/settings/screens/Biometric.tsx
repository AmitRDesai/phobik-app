import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import { BiometricSetup } from '@/modules/auth/components/BiometricSetup';
import { useSignOut } from '@/hooks/auth/useAuth';
import { useBiometricAvailability } from '@/hooks/auth/useBiometric';
import { biometricEnabledAtom } from '@/store/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { Switch } from '@/components/ui/Switch';

export default function Biometric() {
  const { biometricType, isAvailable } = useBiometricAvailability();
  const [biometricEnabled, setBiometricEnabled] = useAtom(biometricEnabledAtom);
  const signOut = useSignOut();

  const handleDisable = () => {
    setBiometricEnabled(false);
  };

  const handleLockApp = async () => {
    await signOut.mutateAsync();
  };

  return (
    <Screen
      scroll
      header={<Header title="Biometric Login" />}
      className="px-4"
      contentClassName="gap-4"
    >
      {!isAvailable ? (
        <Card className="p-6">
          <Text size="md" tone="secondary" align="center">
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
                  <Text size="md" weight="semibold">
                    {biometricType} Enabled
                  </Text>
                  <Text size="sm" tone="secondary">
                    Quick sign-in is active
                  </Text>
                </View>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={(val) => {
                  if (!val) handleDisable();
                }}
              />
            </View>
          </Card>

          <Card
            onPress={handleLockApp}
            className="flex-row items-center justify-center gap-2 py-4"
          >
            <MaterialIcons name="lock" size={20} color={colors.primary.pink} />
            <Text size="md" tone="accent" weight="semibold">
              Lock App
            </Text>
          </Card>
          <Text size="xs" align="center" tone="tertiary" className="px-2">
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

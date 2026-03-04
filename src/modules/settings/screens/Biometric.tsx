import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { BiometricSetup } from '@/modules/auth/components/BiometricSetup';
import { useSignOut } from '@/modules/auth/hooks/useAuth';
import { useBiometricAvailability } from '@/modules/auth/hooks/useBiometric';
import { biometricEnabledAtom } from '@/modules/auth/store/biometric';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Biometric() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-dashboard"
        centerY={0.15}
        intensity={0.5}
      />

      {/* Header */}
      <View
        className="flex-row items-center gap-3 px-4 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5"
        >
          <MaterialIcons name="arrow-back" size={22} color="white" />
        </Pressable>
        <Text className="text-lg font-bold text-white">Biometric Login</Text>
      </View>

      <ScrollView contentContainerClassName="gap-4 px-4 py-4 pb-8">
        {!isAvailable ? (
          <View className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Text className="text-center text-base text-white/50">
              Biometric authentication is not available on this device.
            </Text>
          </View>
        ) : biometricEnabled ? (
          <>
            {/* Status */}
            <View className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-green-500/20">
                    <MaterialIcons
                      name="check-circle"
                      size={22}
                      color="#22c55e"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-white">
                      {biometricType} Enabled
                    </Text>
                    <Text className="text-sm text-white/50">
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
                    false: 'rgba(255,255,255,0.1)',
                    true: colors.primary.pink,
                  }}
                  thumbColor="white"
                />
              </View>
            </View>

            {/* Lock App */}
            <Pressable
              onPress={handleLockApp}
              className="flex-row items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-4 active:opacity-70"
            >
              <MaterialIcons
                name="lock"
                size={20}
                color={colors.primary.pink}
              />
              <Text className="text-base font-semibold text-primary-pink">
                Lock App
              </Text>
            </Pressable>
            <Text className="px-2 text-center text-xs text-white/40">
              Locks the app and requires {biometricType} to re-enter. Your
              session stays active.
            </Text>
          </>
        ) : (
          <BiometricSetup mode="settings" />
        )}

        <View className="h-4" />
      </ScrollView>
    </View>
  );
}

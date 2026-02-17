import { MandalaIcon } from '@/components/icons/MandalaIcon';
import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { useSession } from '@/lib/auth';
import { useSignOut } from '@/modules/auth/hooks/useAuth';
import { biometricEnabledAtom } from '@/modules/auth/store/biometric';
import { dialog } from '@/utils/dialog';
import { Ionicons } from '@expo/vector-icons';
import { useAtomValue } from 'jotai';
import { Pressable, Text, View } from 'react-native';

export default function Home() {
  const { data: session } = useSession();
  const biometricEnabled = useAtomValue(biometricEnabledAtom);
  const signOutMutation = useSignOut();

  const userName = session?.user?.name ?? 'Friend';
  const userEmail = session?.user?.email;

  const handleLock = () => {
    signOutMutation.mutate({});
  };

  const handleSignOut = async () => {
    const result = await dialog.info({
      title: 'Sign Out',
      message:
        'Are you sure you want to sign out? You will need to log in again.',
      buttons: [
        { label: 'Cancel', value: 'cancel', variant: 'secondary' },
        { label: 'Sign Out', value: 'signout', variant: 'destructive' },
      ],
    });

    if (result === 'signout') {
      signOutMutation.mutate({ force: true });
    }
  };

  return (
    <View className="flex-1">
      <GlowBg
        centerY={0.35}
        intensity={0.6}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />
      <Container className="px-6">
        {/* Header — user details */}
        <View className="items-center pt-6">
          <View
            className="h-16 w-16 items-center justify-center rounded-full bg-white/10"
            style={{
              shadowColor: colors.primary.pink,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
            }}
          >
            <Ionicons name="person" size={28} color="white" />
          </View>
          <Text className="mt-3 text-xl font-bold text-white">{userName}</Text>
          {userEmail && (
            <Text className="mt-1 text-sm text-white/50">{userEmail}</Text>
          )}
        </View>

        {/* WIP illustration */}
        <View className="flex-1 items-center justify-center">
          <MandalaIcon size={200} />
          <View className="mt-8 items-center">
            <Ionicons
              name="construct-outline"
              size={32}
              color={colors.accent.yellow}
            />
            <Text className="mt-3 text-2xl font-extrabold text-white">
              Work In Progress
            </Text>
            <Text className="mt-2 text-center text-sm leading-5 text-white/50">
              We&apos;re building something amazing.{'\n'}Stay tuned!
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View className="gap-3 pb-8">
          {biometricEnabled && (
            <Pressable
              onPress={handleLock}
              className="flex-row items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-4"
            >
              <Ionicons name="lock-closed-outline" size={20} color="white" />
              <Text className="text-base font-semibold text-white">Lock</Text>
            </Pressable>
          )}
          <Pressable
            onPress={handleSignOut}
            className="flex-row items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-4"
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-base font-semibold text-white">Sign Out</Text>
          </Pressable>
        </View>
      </Container>
    </View>
  );
}

import { MandalaIcon } from '@/components/icons/MandalaIcon';
import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/constants/colors';
import { warmServer } from '@/lib/server-warmup';
import { Ionicons } from '@expo/vector-icons';
import { GradientText } from '@/components/ui/GradientText';
import { Link, router } from 'expo-router';
import { useEffect } from 'react';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
export default function WelcomeScreen() {
  useEffect(() => {
    warmServer();
  }, []);

  return (
    <Screen
      variant="auth"
      sticky={
        <View className="w-full max-w-sm gap-6 self-center">
          <View className="items-center">
            <ProgressDots total={7} current={1} />
          </View>
          <GradientButton
            onPress={() => router.push('/account-creation/philosophy')}
            icon={<Ionicons name="chevron-forward" size={24} color="white" />}
          >
            Next
          </GradientButton>
          <Link href="/auth/sign-in" replace className="mt-2 py-2">
            <Text className="text-center text-sm text-foreground/55">
              Already have an account?{' '}
              <Text className="font-bold text-primary-pink">Sign In</Text>
            </Text>
          </Link>
        </View>
      }
      className="flex-1 items-center justify-center px-8"
    >
      <View className="items-center">
        <View className="mb-12">
          <MandalaIcon size={288} animated />
        </View>
        <View className="items-center gap-4">
          <View className="flex-row flex-wrap items-center justify-center">
            <Text className="text-center text-4xl font-extrabold tracking-tight text-foreground">
              Welcome to{' '}
            </Text>
            <GradientText className="text-4xl font-extrabold">
              PHOBIK
            </GradientText>
          </View>
          <Text className="text-center text-lg font-semibold text-foreground">
            Create the life you want.
          </Text>
          <Text className="text-center text-lg font-semibold text-foreground">
            Overcome your challenges and face your fears.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

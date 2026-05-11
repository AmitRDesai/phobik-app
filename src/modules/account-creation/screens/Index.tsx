import { Button } from '@/components/ui/Button';
import { MandalaIcon } from '@/components/icons/MandalaIcon';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Screen } from '@/components/ui/Screen';
import { warmServer } from '@/lib/server-warmup';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useEffect } from 'react';

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
          <Button
            onPress={() => router.push('/account-creation/philosophy')}
            icon={<Ionicons name="chevron-forward" size={24} color="white" />}
          >
            Next
          </Button>
          <Link href="/auth/sign-in" replace className="mt-2 py-2">
            <Text size="sm" tone="secondary" align="center">
              Already have an account?{' '}
              <Text size="sm" tone="accent" weight="bold">
                Sign In
              </Text>
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
            <Text size="display" align="center" className="tracking-tight">
              Welcome to{' '}
            </Text>
            <GradientText className="text-4xl font-extrabold">
              PHOBIK
            </GradientText>
          </View>
          <Text size="h3" align="center">
            Create the life you want.
          </Text>
          <Text size="h3" align="center">
            Overcome your challenges and face your fears.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

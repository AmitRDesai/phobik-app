import { MandalaIcon } from '@/components/icons/MandalaIcon';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { InlineLink } from '@/components/ui/InlineLink';
import { Screen } from '@/components/ui/Screen';
import { useProfileStatus } from '@/hooks/auth/useProfile';
import { useUserId } from '@/lib/powersync/useUserId';
import { warmServer } from '@/lib/server-warmup';
import { onboardingTermsAcceptedAtAtom } from '@/store/onboarding';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

export default function Welcome() {
  const userId = useUserId();
  const termsAcceptedAt = useAtomValue(onboardingTermsAcceptedAtAtom);
  const { data: profileStatus } = useProfileStatus(!!userId);

  useEffect(() => {
    warmServer();
  }, []);

  // An authenticated user should never see the pre-signup Welcome hero.
  if (userId) {
    // Onboarding just finished — render nothing while the root guard routes
    // to the dashboard, so the Welcome hero doesn't flash during teardown.
    if (profileStatus.onboardingCompleted) return null;
    // Finished the questionnaire before authenticating (email path) and has
    // since signed up + verified — resume at the completion screen.
    if (termsAcceptedAt) return <Redirect href="/onboarding/completion" />;
  }

  return (
    <Screen
      transparent
      insetTop={false}
      sticky={
        <View className="w-full max-w-sm gap-6 self-center">
          <Button
            onPress={() => router.push('/onboarding/personalization')}
            icon={<Ionicons name="chevron-forward" size={24} color="white" />}
            fullWidth
          >
            Get Started
          </Button>
          <InlineLink
            prefix="Already have an account?"
            action="Sign In"
            onPress={() => router.replace('/auth/sign-in')}
          />
        </View>
      }
      className="flex-1 items-center justify-center px-screen-x"
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
            Small shifts. Better rhythms. Stronger you.
          </Text>
          <Text size="md" tone="secondary" align="center" className="mt-1">
            We&apos;ll learn a little about you so we can personalize your
            experience and help you build a calmer mind, steadier energy, and
            healthier daily patterns.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

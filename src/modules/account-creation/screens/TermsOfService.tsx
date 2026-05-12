import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import { useSaveProfile } from '@/hooks/auth/useProfile';
import { questionnaireAtom } from '@/store/onboarding';
import { dialog } from '@/utils/dialog';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useState } from 'react';
import { StepCounter } from '@/components/ui/StepCounter';

export default function TermsOfServiceScreen() {
  const { modal } = useLocalSearchParams<{ modal?: string }>();
  const isModal = modal === 'true';
  const pathname = usePathname();
  const isProfileSetup = pathname.startsWith('/profile-setup');

  const totalSteps = isProfileSetup ? 5 : 7;
  const currentStep = isProfileSetup ? 5 : 7;

  const setQuestionnaire = useSetAtom(questionnaireAtom);
  const questionnaire = useAtomValue(questionnaireAtom);

  const saveProfile = useSaveProfile();
  const [isSaving, setIsSaving] = useState(false);

  const handleAccept = async () => {
    const now = new Date().toISOString();

    if (isProfileSetup) {
      setIsSaving(true);
      try {
        await saveProfile.mutateAsync({
          ageRange: questionnaire.age,
          genderIdentity: questionnaire.gender,
          goals: questionnaire.goals,
          termsAcceptedAt: now,
          privacyAcceptedAt: now,
        });
        setQuestionnaire(RESET);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'An error occurred';
        dialog.error({ title: 'Save Failed', message });
      }
      setIsSaving(false);
    } else {
      setQuestionnaire((prev) => ({
        ...prev,
        termsAcceptedAt: now,
        privacyAcceptedAt: now,
      }));
      router.replace('/auth/create-account');
    }
  };

  return (
    <Screen
      variant="auth"
      scroll
      presentation={isModal ? 'modal' : undefined}
      insetTop={isModal ? undefined : false}
      header={
        isModal ? <Header left={<BackButton icon="close" />} /> : undefined
      }
      sticky={
        <View className="w-full items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            prefixIcon={
              <Ionicons
                name="document-text-outline"
                size={18}
                color={colors.primary.pink}
              />
            }
          >
            Download full Terms of Service (PDF)
          </Button>
          {!isModal && (
            <>
              <Button onPress={handleAccept} loading={isSaving} fullWidth>
                I Accept the Terms
              </Button>
              <Button
                variant="ghost"
                onPress={() => router.back()}
                disabled={isSaving}
                className="mt-2"
                fullWidth
              >
                Decline
              </Button>
              <StepCounter current={currentStep} total={totalSteps} />
            </>
          )}
        </View>
      }
      className={isModal ? 'px-screen-x' : 'px-screen-x pt-[68px]'}
    >
      <View className="mb-4 items-center">
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            boxShadow: `0 4px 12px ${withAlpha(colors.primary.pink, 0.2)}`,
          }}
        >
          <Ionicons name="shield-checkmark" size={36} color="white" />
        </LinearGradient>
        <Text size="h1" className="tracking-tight">
          Terms of Service
        </Text>
        <Text size="xs" tone="secondary" className="mt-2">
          Phobik (PBK) App
        </Text>
      </View>
      <Card className="mb-4 p-6">
        <Text size="lg" align="center" weight="bold">
          Phobik is a wellness and self development app designed to provide
          educational tools and personal growth. It is not a healthcare provider
          and does not provide medical advice, diagnosis or therapy.
        </Text>
      </Card>
      <View className="px-2">
        <Text size="md" tone="secondary" align="center">
          By continuing, you agree to our full Terms of Service which govern
          your account, subscriptions, and use of our community and biometric
          features.
        </Text>
      </View>
    </Screen>
  );
}

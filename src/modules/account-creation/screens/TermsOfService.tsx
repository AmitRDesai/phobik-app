import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { ProgressDots } from '@/components/ui/ProgressDots';
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
import { Pressable, Text, View } from 'react-native';

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
      header={
        <Header
          left={<BackButton icon={isModal ? 'close' : 'arrow-back'} />}
          center={
            !isModal ? (
              <ProgressDots total={totalSteps} current={currentStep} />
            ) : null
          }
        />
      }
      sticky={
        <View className="items-center">
          <Pressable className="mb-4 flex-row items-center gap-2 py-2">
            <Ionicons
              name="document-text-outline"
              size={18}
              color={colors.primary.pink}
            />
            <Text className="text-sm font-semibold text-primary-pink">
              Download full Terms of Service (PDF)
            </Text>
          </Pressable>
          {!isModal && (
            <>
              <GradientButton onPress={handleAccept} loading={isSaving}>
                I Accept the Terms
              </GradientButton>
              <Button
                variant="ghost"
                onPress={() => router.back()}
                disabled={isSaving}
                className="mt-2"
              >
                Decline
              </Button>
              <Text className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/55">
                Step {currentStep} of {totalSteps}
              </Text>
            </>
          )}
        </View>
      }
      className="grow justify-center px-8 pt-2"
    >
      <View className="mb-6 items-center">
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
            marginBottom: 20,
            boxShadow: `0 4px 12px ${withAlpha(colors.primary.pink, 0.2)}`,
          }}
        >
          <Ionicons name="shield-checkmark" size={36} color="white" />
        </LinearGradient>
        <Text className="text-3xl font-extrabold tracking-tight text-foreground">
          Terms of Service
        </Text>
        <Text className="mt-2 text-sm font-semibold uppercase tracking-widest text-foreground/55">
          Phobik (PBK) App
        </Text>
      </View>
      <Card className="mb-4 p-6">
        <Text className="text-center text-[16px] font-bold leading-relaxed text-foreground">
          Phobik is a wellness and self development app designed to provide
          educational tools and personal growth. It is not a healthcare provider
          and does not provide medical advice, diagnosis or therapy.
        </Text>
      </Card>
      <View className="px-2">
        <Text className="text-center text-[15px] leading-relaxed text-foreground/55">
          By continuing, you agree to our full Terms of Service which govern
          your account, subscriptions, and use of our community and biometric
          features.
        </Text>
      </View>
    </Screen>
  );
}

import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useSetAtom } from 'jotai';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg } from '../components/GlowBg';
import {
  onboardingCompletedAtom,
  privacyAcceptedAtom,
  termsAcceptedAtom,
} from '../store/onboarding';

export default function TermsOfServiceScreen() {
  const { modal } = useLocalSearchParams<{ modal?: string }>();
  const isModal = modal === 'true';

  const setTermsAccepted = useSetAtom(termsAcceptedAtom);
  const setPrivacyAccepted = useSetAtom(privacyAcceptedAtom);
  const setOnboardingCompleted = useSetAtom(onboardingCompletedAtom);

  const handleAccept = () => {
    setTermsAccepted(true);
    setPrivacyAccepted(true);
    setOnboardingCompleted(true);
    router.replace('/auth/create-account');
  };

  return (
    <View className="flex-1">
      <GlowBg intensity={0} />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1">
          {/* Header */}
          <View className="z-20 flex-row items-center justify-between px-6 pb-4 pt-8">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-start justify-center"
            >
              <Ionicons
                name={isModal ? 'close' : 'chevron-back'}
                size={24}
                color="rgba(255,255,255,0.5)"
              />
            </Pressable>

            {!isModal && <ProgressDots total={7} current={7} />}

            {/* Empty view for spacing */}
            <View className="w-10" />
          </View>

          {/* Scrollable Content */}
          <ScrollFade>
            <ScrollView
              className="flex-1"
              contentContainerClassName="grow justify-center px-8"
              contentContainerStyle={{ paddingBottom: FADE_HEIGHT }}
              showsVerticalScrollIndicator={false}
            >
              {/* Shield Icon + Title */}
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
                    shadowColor: colors.primary.pink,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 12,
                  }}
                >
                  <Ionicons name="shield-checkmark" size={36} color="white" />
                </LinearGradient>

                <Text className="text-3xl font-extrabold tracking-tight text-white">
                  Terms of Service
                </Text>
                <Text className="mt-2 text-sm font-semibold uppercase tracking-widest text-white/40">
                  Phobik (PBK) App
                </Text>
              </View>

              {/* Disclaimer Card */}
              <View className="mb-4">
                <View className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <Text className="text-center text-[16px] font-bold leading-relaxed text-white">
                    Phobik is a wellness and self development app designed to
                    provide educational tools and personal growth. It is not a
                    healthcare provider and does not provide medical advice,
                    diagnosis or therapy.
                  </Text>
                </View>
              </View>

              {/* By continuing text */}
              <View className="px-2">
                <Text className="text-center text-[15px] leading-relaxed text-gray-400">
                  By continuing, you agree to our full Terms of Service which
                  govern your account, subscriptions, and use of our community
                  and biometric features.
                </Text>
              </View>
            </ScrollView>
          </ScrollFade>

          {/* Footer */}
          <View className="z-10 items-center px-8 pb-8">
            {/* Download link */}
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
                <GradientButton onPress={handleAccept}>
                  I Accept the Terms
                </GradientButton>

                <Text className="mb-2 mt-6 text-[11px] font-bold tracking-[0.2em] text-white/30">
                  STEP 7 OF 7
                </Text>

                <Pressable
                  onPress={() => router.back()}
                  className="w-full py-4"
                >
                  <Text className="text-center text-sm font-semibold text-gray-500">
                    Decline
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

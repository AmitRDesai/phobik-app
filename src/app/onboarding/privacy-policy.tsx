import { colors } from '@/constants/colors';
import { GradientButton } from '@/components/ui/GradientButton';
import {
  onboardingCompletedAtom,
  privacyAcceptedAtom,
} from '@/store/onboarding';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSetAtom } from 'jotai';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
  const setPrivacyAccepted = useSetAtom(privacyAcceptedAtom);
  const setOnboardingCompleted = useSetAtom(onboardingCompletedAtom);

  const handleAccept = () => {
    setPrivacyAccepted(true);
    setOnboardingCompleted(true);
    router.replace('/auth/create-account');
  };

  const handleShare = async () => {
    await Share.share({
      message: 'Phobik Privacy Policy — https://phobik.com/privacy',
    });
  };

  return (
    <View className="flex-1 bg-background-charcoal">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        {/* Header */}
        <View className="border-b border-white/5 px-4 pb-4 pt-3">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="flex-row items-center"
            >
              <Ionicons
                name="chevron-back"
                size={28}
                color={colors.primary.pink}
              />
              <Text
                className="text-[17px]"
                style={{ color: colors.primary.pink }}
              >
                Back
              </Text>
            </Pressable>
            <Text className="text-[17px] font-semibold text-white">
              Privacy Policy
            </Text>
            <Pressable onPress={handleShare} className="p-2">
              <Ionicons
                name="share-outline"
                size={22}
                color={colors.primary.pink}
              />
            </Pressable>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingTop: 32, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Title Block */}
          <View className="mb-12">
            <Text className="text-3xl font-bold leading-tight tracking-tight text-white">
              Phobik (PBK) – Privacy Policy
            </Text>
            <View className="mt-4 flex-row items-center gap-2">
              <View
                className="h-[2px] w-8"
                style={{ backgroundColor: colors.primary.pink }}
              />
              <Text
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: colors.primary.pink }}
              >
                Effective: January 24, 2026
              </Text>
            </View>
          </View>

          {/* Section 1 */}
          <View className="mb-12">
            <SectionHeading number="1" title="Information We Collect" />
            <View className="gap-8">
              <SubSection
                icon="person-circle-outline"
                label="A. Account Information"
              >
                We collect your name, email address, and age when you create a
                PHOBIK profile to personalize your mental wellness journey.
              </SubSection>
              <SubSection icon="create-outline" label="B. User Content">
                This includes mood logs, journals, and reflections you record
                within the app. This data is private and encrypted.
              </SubSection>
              <SubSection
                icon="heart-outline"
                label="C. Health & Biometric Data"
              >
                To provide advanced mental health insights, PHOBIK analyzes
                facial micro-expressions and Heart Rate Variability (HRV).
                Processed locally on-device; raw images are never uploaded. Only
                derived numerical scores are stored with end-to-end encryption.
              </SubSection>
              <SubSection
                icon="phone-portrait-outline"
                label="D. Device Information"
              >
                We collect IP addresses, device types, and OS versions to ensure
                app compatibility and security.
              </SubSection>
              <SubSection icon="people-outline" label="E. Community Data">
                Interaction data within PHOBIK forums or peer support groups is
                stored to facilitate conversation and safety monitoring.
              </SubSection>
            </View>
          </View>

          {/* Section 2 */}
          <View className="mb-12">
            <SectionHeading number="2" title="Community Features & Anonymity" />
            <Text className="text-sm leading-relaxed text-white/50">
              PHOBIK is built on a foundation of safety. Community features use{' '}
              <Text className="font-semibold text-white">
                default anonymity
              </Text>
              . Your real name is never displayed to other users unless you
              explicitly choose to reveal it.
            </Text>
          </View>

          {/* Section 3 */}
          <View className="mb-12">
            <SectionHeading number="3" title="How We Use Information" />
            <Text className="text-sm leading-relaxed text-white/50">
              Data is used to generate your Anxiety Score, provide personalized
              coping strategies, improve our AI algorithms, and facilitate peer
              connections.
            </Text>
          </View>

          {/* Section 4 */}
          <View className="mb-12">
            <SectionHeading number="4" title="How We Share Information" />
            <Text className="mb-4 text-sm leading-relaxed text-white/50">
              We do not, and will never, sell your personal or health data to
              third-party advertisers or data brokers.
            </Text>
            <View
              className="pl-4"
              style={{
                borderLeftWidth: 2,
                borderLeftColor: colors.primary.pink,
              }}
            >
              <Text className="text-xs leading-relaxed text-white/40">
                We may only share data with service providers (e.g., cloud
                storage) necessary for app operation, or when required by law
                for safety reasons.
              </Text>
            </View>
          </View>

          {/* Section 5 */}
          <View className="mb-12">
            <SectionHeading number="5" title="Your Rights & Choices" />
            <Text className="text-sm leading-relaxed text-white/50">
              You have the right to access, correct, or delete your data at any
              time through the app settings. You may also request a copy of your
              data in a portable format.
            </Text>
          </View>

          {/* Section 6 */}
          <View className="mb-12">
            <SectionHeading number="6" title="Data Retention" />
            <Text className="text-sm leading-relaxed text-white/50">
              We retain your information as long as your account is active. If
              you delete your account, your data is scrubbed from our production
              databases within 30 days.
            </Text>
          </View>

          {/* Section 7 */}
          <View className="mb-12">
            <SectionHeading number="7" title="Data Security" />
            <Text className="text-sm leading-relaxed text-white/50">
              We use AES-256 encryption for data at rest and TLS 1.3 for data in
              transit. Regular security audits are conducted to maintain
              HIPAA-level compliance.
            </Text>
          </View>

          {/* Section 8 */}
          <View className="mb-12">
            <SectionHeading number="8" title="Children's Privacy" />
            <Text className="text-sm leading-relaxed text-white/50">
              PHOBIK is intended for individuals 18 years of age or older. We do
              not knowingly collect information from children. If we discover
              such data, we delete it immediately.
            </Text>
          </View>

          {/* Section 9 */}
          <View className="mb-12">
            <SectionHeading number="9" title="International Users" />
            <Text className="text-sm leading-relaxed text-white/50">
              Your data may be transferred to and processed in the United
              States. We use Standard Contractual Clauses (SCCs) for
              cross-border data protection.
            </Text>
          </View>

          {/* Section 10 */}
          <View className="mb-12">
            <SectionHeading number="10" title="Changes to Policy" />
            <Text className="text-sm leading-relaxed text-white/50">
              We may update this policy periodically. We will notify you of any
              significant changes via in-app notification or email.
            </Text>
          </View>

          {/* Section 11 - Contact Us */}
          <View className="mb-20">
            <SectionHeading number="11" title="Contact Us" />
            <View className="rounded-2xl border border-white/5 bg-background-charcoal p-6">
              <Text className="mb-4 text-sm text-white/50">
                Have questions about your data? Reach out to our privacy
                officer:
              </Text>
              <View className="gap-3">
                <View className="flex-row items-center gap-3">
                  <Ionicons name="mail" size={20} color={colors.primary.pink} />
                  <Text className="text-sm font-medium text-white">
                    support@phobikapp.com
                  </Text>
                </View>
                <View className="flex-row items-start gap-3">
                  <Ionicons
                    name="location"
                    size={20}
                    color={colors.primary.pink}
                    style={{ marginTop: 2 }}
                  />
                  <Text className="text-sm leading-tight text-white/70">
                    Phobik, Inc.{'\n'}8 The Green, Ste B{'\n'}Dover, DE 19901
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="border-t border-white/5 px-6 pb-6 pt-4">
          <GradientButton onPress={handleAccept}>
            I Accept & Continue
          </GradientButton>
          <Text className="mt-4 text-center text-[10px] font-bold uppercase tracking-[4px] text-white/20">
            PBK-PP-2026-V1
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <Text className="mb-4 text-xl font-bold text-white">
      <Text style={{ color: colors.primary.pink }}>{number}.</Text> {title}
    </Text>
  );
}

function SubSection({
  icon,
  label,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  children: string;
}) {
  return (
    <View>
      <View className="mb-2 flex-row items-center gap-2">
        <Ionicons name={icon} size={18} color={colors.accent.yellow} />
        <Text
          className="text-sm font-bold uppercase tracking-wide"
          style={{ color: colors.accent.yellow }}
        >
          {label}
        </Text>
      </View>
      <Text className="text-sm leading-relaxed text-white/50">{children}</Text>
    </View>
  );
}

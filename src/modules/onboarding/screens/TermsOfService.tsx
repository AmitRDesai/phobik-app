import { colors } from '@/constants/colors';
import { GradientButton } from '@/components/ui/GradientButton';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useCallback, useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { termsAcceptedAtom } from '../store/onboarding';

export default function TermsOfServiceScreen() {
  const setTermsAccepted = useSetAtom(termsAcceptedAtom);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const totalScrollable = contentSize.height - layoutMeasurement.height;
      if (totalScrollable > 0) {
        const scrolledRatio = contentOffset.y / totalScrollable;
        if (scrolledRatio >= 0.95) {
          setHasScrolledToBottom(true);
        }
      }
    },
    [],
  );

  const handleAccept = () => {
    setTermsAccepted(true);
    router.push('/onboarding/privacy-policy');
  };

  const handleDecline = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-background-charcoal">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        {/* Header */}
        <View className="border-b border-white/10 px-4 pb-4 pt-4">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full"
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color="rgba(255,255,255,0.5)"
              />
            </Pressable>
            <Text className="flex-1 pr-10 text-center text-base font-bold text-white">
              Terms of Service
            </Text>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingTop: 32, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Title Block */}
          <View className="mb-10 items-center">
            <Text className="mb-2 text-3xl font-extrabold tracking-tight text-white">
              Phobik (PBK)
            </Text>
            <Text className="mb-1 text-lg font-medium text-white/60">
              Terms of Service
            </Text>
            <View className="flex-row items-center gap-2">
              <Ionicons
                name="calendar-outline"
                size={14}
                color={colors.accent.yellow}
              />
              <Text
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: colors.accent.yellow }}
              >
                Effective Date: January 24, 2026
              </Text>
            </View>
          </View>

          {/* Section 1 - Agreement to Terms */}
          <View className="mb-10">
            <CenteredDividerHeading
              number={1}
              title="Agreement to Terms"
              color={colors.primary.pink}
            />
            <Text className="text-[15px] leading-relaxed text-gray-400">
              These Terms of Service constitute a legally binding agreement
              between you and Phobik (PBK). By accessing our mobile application,
              you agree that you have read, understood, and agreed to be bound
              by all of these terms.
            </Text>
          </View>

          {/* Section 2 - Nature of the Services (pink background card) */}
          <View className="mb-10">
            <View
              className="rounded-2xl p-4"
              style={{
                backgroundColor: `${colors.primary.pink}0D`,
                borderWidth: 1,
                borderColor: `${colors.primary.pink}33`,
              }}
            >
              <YellowLineHeading number={2} title="Nature of the Services" />
              <View className="gap-3">
                <Text className="text-base font-semibold leading-relaxed text-white">
                  IMPORTANT: Phobik is NOT a healthcare provider and does NOT
                  provide medical advice, diagnosis, or therapy.
                </Text>
                <Text className="text-sm leading-relaxed text-gray-400">
                  The Service is designed to be a self-help support tool. It is
                  not intended to replace professional medical advice,
                  psychotherapy, or emergency intervention. Always seek the
                  advice of your physician or other qualified health provider
                  with any questions you may have regarding a medical condition.
                </Text>
                {/* Crisis warning callout */}
                <View
                  className="rounded-lg p-3"
                  style={{
                    backgroundColor: `${colors.accent.yellow}1A`,
                    borderWidth: 1,
                    borderColor: `${colors.accent.yellow}33`,
                  }}
                >
                  <Text
                    className="text-xs font-bold leading-tight"
                    style={{ color: colors.accent.yellow }}
                  >
                    IF YOU ARE IN A CRISIS OR AN EMERGENCY SITUATION, CONTACT
                    EMERGENCY SERVICES IMMEDIATELY.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Section 3 - Eligibility */}
          <View className="mb-10">
            <DotHeading
              number={3}
              title="Eligibility"
              color={colors.primary.pink}
            />
            <Text className="text-sm leading-relaxed text-gray-400">
              You must be at least 18 years of age to use the Service. By using
              the Service, you represent and warrant that you have the right,
              authority, and capacity to enter into these Terms.
            </Text>
          </View>

          {/* Section 4 - Account Registration */}
          <View className="mb-10">
            <DotHeading
              number={4}
              title="Account Registration"
              color={colors.accent.yellow}
            />
            <Text className="text-sm leading-relaxed text-gray-400">
              To access certain features, you must register for an account. You
              agree to provide accurate, current, and complete information and
              to maintain the security of your password.
            </Text>
          </View>

          {/* Section 5 - User Content */}
          <View className="mb-10">
            <DotHeading
              number={5}
              title="User Content"
              color={colors.primary.pink}
            />
            <Text className="text-sm leading-relaxed text-gray-400">
              You are solely responsible for the content you post, including
              journals and community messages. We reserve the right to remove
              any content that violates our community standards.
            </Text>
          </View>

          {/* Section 6 - Subscription Terms (card) */}
          <View className="mb-10">
            <View
              className="rounded-2xl border border-white/5 p-5"
              style={{ backgroundColor: '#171717' }}
            >
              <Text className="mb-4 text-lg font-bold text-white">
                6. Subscription Terms
              </Text>
              <View className="gap-4">
                <View className="flex-row gap-3">
                  <Ionicons
                    name="diamond-outline"
                    size={20}
                    color={colors.primary.pink}
                    style={{ marginTop: 2 }}
                  />
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-white">
                      3-Day Free Trial
                    </Text>
                    <Text className="text-xs leading-relaxed text-gray-400">
                      Access all premium features free for 72 hours. You will
                      not be charged if you cancel before the trial period ends.
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-3">
                  <Ionicons
                    name="close-circle-outline"
                    size={20}
                    color={colors.accent.yellow}
                    style={{ marginTop: 2 }}
                  />
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-white">
                      Cancellation Policy
                    </Text>
                    <Text className="text-xs leading-relaxed text-gray-400">
                      Subscriptions automatically renew unless canceled at least
                      24 hours before the end of the current period via your App
                      Store settings.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Section 7 - Intellectual Property */}
          <View className="mb-10">
            <PlainHeading
              number={7}
              title="Intellectual Property"
              color={colors.primary.pink}
            />
            <Text className="text-sm leading-relaxed text-gray-400">
              All content, including the Phobik logo, designs, text, graphics,
              and software, is the property of Phobik and is protected by
              copyright laws.
            </Text>
          </View>

          {/* Section 8 - Prohibited Conduct */}
          <View className="mb-10">
            <PlainHeading
              number={8}
              title="Prohibited Conduct"
              color={colors.accent.yellow}
            />
            <Text className="text-sm leading-relaxed text-gray-400">
              You agree not to use the Service for any unlawful purpose or to
              solicit others to perform or participate in any unlawful acts.
            </Text>
          </View>

          {/* Section 9 - Privacy Policy */}
          <View className="mb-10">
            <PlainHeading
              number={9}
              title="Privacy Policy"
              color={colors.primary.pink}
            />
            <Text className="text-sm leading-relaxed text-gray-400">
              Your use of the Service is also governed by our Privacy Policy,
              which is incorporated into these Terms by reference.
            </Text>
          </View>

          {/* Section 10 - Modifications */}
          <View className="mb-10">
            <PlainHeading
              number={10}
              title="Modifications"
              color={colors.accent.yellow}
            />
            <Text className="text-sm leading-relaxed text-gray-400">
              We reserve the right to modify these terms at any time. We will
              notify you of any changes by updating the {'"'}Effective Date{'"'}{' '}
              at the top.
            </Text>
          </View>

          {/* Section 11 - Termination */}
          <View className="mb-10">
            <PlainHeading
              number={11}
              title="Termination"
              color={colors.primary.pink}
            />
            <Text className="text-sm leading-relaxed text-gray-400">
              We may terminate or suspend your account immediately, without
              prior notice, for conduct that we believe violates these Terms or
              is harmful to other users.
            </Text>
          </View>

          {/* Section 12 - Limitation of Liability */}
          <View className="mb-10">
            <PlainHeading
              number={12}
              title="Limitation of Liability"
              color={colors.accent.yellow}
            />
            <Text className="text-sm italic leading-relaxed text-gray-400">
              In no event shall Phobik, its directors, or employees be liable
              for any indirect, incidental, special, or consequential damages
              resulting from your use of the service.
            </Text>
          </View>

          {/* Section 13 - Disclaimer of Warranties */}
          <View className="mb-10">
            <PlainHeading
              number={13}
              title="Disclaimer of Warranties"
              color={colors.primary.pink}
            />
            <Text className="text-sm leading-relaxed text-gray-400">
              The service is provided on an {'"'}AS IS{'"'} and {'"'}AS
              AVAILABLE{'"'} basis without any warranties of any kind.
            </Text>
          </View>

          {/* Section 14 - Governing Law */}
          <View className="mb-10">
            <PlainHeading
              number={14}
              title="Governing Law"
              color={colors.accent.yellow}
            />
            <Text className="text-sm leading-relaxed text-gray-400">
              These Terms shall be governed and construed in accordance with the
              laws of the State of Delaware, United States.
            </Text>
          </View>

          {/* Section 15 - Contact Information */}
          <View className="mb-10 border-t border-white/5 pt-10">
            <PlainHeading
              number={15}
              title="Contact Information"
              color={colors.primary.pink}
            />
            <View className="gap-4">
              <Text className="text-sm text-gray-400">
                If you have any questions about these Terms, please contact us
                at:
              </Text>
              <View
                className="gap-2 rounded-xl p-4"
                style={{ backgroundColor: '#171717' }}
              >
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name="mail-outline"
                    size={16}
                    color={colors.primary.pink}
                  />
                  <Text className="font-medium text-white">
                    support@phobik.app
                  </Text>
                </View>
                <View className="flex-row items-start gap-2">
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={colors.accent.yellow}
                    style={{ marginTop: 2 }}
                  />
                  <Text className="font-medium text-white">
                    8 The Green, Ste B{'\n'}Dover, DE 19901
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="border-t border-white/5 px-6 pb-6 pt-4">
          <GradientButton
            onPress={handleAccept}
            disabled={!hasScrolledToBottom}
          >
            I Accept the Terms
          </GradientButton>
          <View className="h-3" />
          <Pressable
            onPress={handleDecline}
            className="w-full items-center rounded-2xl bg-white/5 py-4"
          >
            <Text className="text-base font-semibold text-white/40">
              Decline
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ── Section Heading Variants ── */

/** Centered divider style: ── 1. Title ── */
function CenteredDividerHeading({
  number,
  title,
  color,
}: {
  number: number;
  title: string;
  color: string;
}) {
  return (
    <View className="mb-4 flex-row items-center gap-3">
      <View className="h-px flex-1" style={{ backgroundColor: `${color}4D` }} />
      <Text
        className="text-sm font-bold uppercase tracking-wider"
        style={{ color }}
      >
        {number}. {title}
      </Text>
      <View className="h-px flex-1" style={{ backgroundColor: `${color}4D` }} />
    </View>
  );
}

/** Yellow left-line style: ─── 2. Title */
function YellowLineHeading({
  number,
  title,
}: {
  number: number;
  title: string;
}) {
  return (
    <View className="mb-4 flex-row items-center gap-3">
      <View
        className="h-px w-6"
        style={{ backgroundColor: `${colors.accent.yellow}4D` }}
      />
      <Text
        className="text-sm font-bold uppercase tracking-wider"
        style={{ color: colors.accent.yellow }}
      >
        {number}. {title}
      </Text>
    </View>
  );
}

/** Dot prefix style: • 3. Title */
function DotHeading({
  number,
  title,
  color,
}: {
  number: number;
  title: string;
  color: string;
}) {
  return (
    <View className="mb-4 flex-row items-center gap-2">
      <View
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text
        className="text-sm font-bold uppercase tracking-wider"
        style={{ color }}
      >
        {number}. {title}
      </Text>
    </View>
  );
}

/** Plain heading (no prefix decoration) */
function PlainHeading({
  number,
  title,
  color,
}: {
  number: number;
  title: string;
  color: string;
}) {
  return (
    <Text
      className="mb-4 text-sm font-bold uppercase tracking-wider"
      style={{ color }}
    >
      {number}. {title}
    </Text>
  );
}

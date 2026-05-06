import { BackButton } from '@/components/ui/BackButton';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientText } from '@/components/ui/GradientText';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { Text } from '@/components/themed/Text';
import { Pressable, View } from 'react-native';
const SECURITY_POINTS = [
  {
    title: 'Biometric data never leaves your device',
    description:
      "Your facial data and fingerprints are processed locally using Apple's Secure Enclave.",
  },
  {
    title: 'End-to-end encrypted journaling',
    description:
      'Only you hold the keys to your thoughts. Even we cannot access your journal entries.',
  },
  {
    title: 'Absolute anonymity in our community',
    description:
      'Interact without fear. Your identity is fully protected through randomized aliases.',
  },
];

export default function DataSecurityPromiseScreen() {
  const { modal } = useLocalSearchParams<{ modal?: string }>();
  const isModal = modal === 'true';
  const pathname = usePathname();
  const isProfileSetup = pathname.startsWith('/profile-setup');

  const totalSteps = isProfileSetup ? 5 : 7;
  const currentStep = isProfileSetup ? 4 : 6;
  const nextRoute = isProfileSetup
    ? '/profile-setup/terms-of-service'
    : '/account-creation/terms-of-service';

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
          {!isModal && (
            <GradientButton onPress={() => router.push(nextRoute)}>
              Agree and Continue
            </GradientButton>
          )}
          <Pressable className="mb-1 mt-6">
            <Text className="text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/60 underline underline-offset-4">
              Download full privacy policy
            </Text>
          </Pressable>
          {!isModal && (
            <Text className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/55">
              Step {currentStep} of {totalSteps}
            </Text>
          )}
        </View>
      }
      className="px-8 pt-2"
    >
      <Text className="text-center text-xs font-black uppercase tracking-[0.3em] text-foreground/55">
        Security
      </Text>
      <View className="mb-10 mt-4 items-center">
        <Text className="text-center text-3xl font-extrabold leading-tight tracking-tight text-foreground">
          Your Privacy is
        </Text>
        <GradientText className="text-center text-3xl font-extrabold leading-tight tracking-tight">
          Our Priority
        </GradientText>
      </View>
      <View className="mb-14 items-center justify-center py-8">
        <View className="absolute h-56 w-56 rounded-full border border-foreground/10" />
        <View className="absolute h-44 w-44 rounded-full border border-foreground/15" />
        <View className="absolute h-32 w-32 rounded-full border border-foreground/20" />
        <View className="h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-foreground/20">
          <LinearGradient
            colors={[`${colors.primary.pink}33`, `${colors.accent.yellow}33`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          />
          <MaterialCommunityIcons
            name="lock"
            size={48}
            color={colors.primary.pink}
          />
        </View>
      </View>
      <View className="mb-8 gap-8">
        {SECURITY_POINTS.map((point) => (
          <View key={point.title} className="flex-row gap-4">
            <IconChip
              size={36}
              shape="circle"
              bg={withAlpha(colors.status.success, 0.15)}
              className="mt-1"
            >
              <Ionicons
                name="checkmark"
                size={20}
                color={colors.status.success}
              />
            </IconChip>
            <View className="flex-1">
              <Text className="text-base font-bold leading-tight text-foreground">
                {point.title}
              </Text>
              <Text className="mt-1 text-sm leading-relaxed text-foreground/60">
                {point.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

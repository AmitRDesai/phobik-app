import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams, usePathname } from 'expo-router';

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
  const scheme = useScheme();
  // status.success (#0bda8e) is a bright mint that washes out on white.
  // Use a deeper green-700 for light mode so both the chip tint and the
  // checkmark icon read with proper contrast against bg-surface.
  const checkAccent =
    scheme === 'dark' ? colors.status.success : colors.green[700];
  const checkBg = withAlpha(checkAccent, scheme === 'dark' ? 0.15 : 0.18);
  const checkBorder = withAlpha(checkAccent, scheme === 'dark' ? 0 : 0.4);

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
            <Button onPress={() => router.push(nextRoute)}>
              Agree and Continue
            </Button>
          )}
          <Button variant="ghost" size="sm" className="mb-1 mt-6">
            Download full privacy policy
          </Button>
          {!isModal && (
            <Text
              size="xs"
              treatment="caption"
              tone="secondary"
              className="mt-3 tracking-[0.2em]"
              style={{ paddingRight: 2.2 }}
            >
              Step {currentStep} of {totalSteps}
            </Text>
          )}
        </View>
      }
      className="px-8 pt-2"
    >
      <Text
        size="xs"
        treatment="caption"
        tone="secondary"
        align="center"
        className="tracking-[0.3em]"
      >
        Security
      </Text>
      <View className="mb-10 mt-4 items-center">
        <Text size="h1" align="center">
          Your Privacy is
        </Text>
        <GradientText className="text-center text-3xl font-extrabold leading-tight">
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
              size={28}
              shape="circle"
              bg={checkBg}
              border={checkBorder}
              className="mt-1"
            >
              <Ionicons name="checkmark" size={16} color={checkAccent} />
            </IconChip>
            <View className="flex-1">
              <Text size="md" weight="bold">
                {point.title}
              </Text>
              <Text size="sm" tone="secondary" className="mt-1">
                {point.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

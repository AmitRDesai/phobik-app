import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { onboardingPrivacyAcceptedAtAtom } from '@/store/onboarding';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSetAtom } from 'jotai';

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
];

export default function Privacy() {
  const scheme = useScheme();
  const setPrivacyAcceptedAt = useSetAtom(onboardingPrivacyAcceptedAtAtom);
  // status.success (#0bda8e) washes out on white — use a deeper green in light.
  const checkAccent =
    scheme === 'dark' ? colors.status.success : colors.green[700];
  const checkBg = withAlpha(checkAccent, scheme === 'dark' ? 0.15 : 0.18);
  const checkBorder = withAlpha(checkAccent, scheme === 'dark' ? 0 : 0.4);

  const handleContinue = () => {
    setPrivacyAcceptedAt(new Date().toISOString());
    router.push('/onboarding/terms');
  };

  return (
    <Screen
      transparent
      scroll
      insetTop={false}
      sticky={
        <View className="w-full items-center">
          <Button onPress={handleContinue} fullWidth>
            Agree and Continue
          </Button>
          <Button variant="ghost" size="sm" className="mb-1 mt-4">
            Download full privacy policy
          </Button>
        </View>
      }
      className="px-screen-x"
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
        <View className="absolute size-56 rounded-full border border-foreground/10" />
        <View className="absolute size-44 rounded-full border border-foreground/15" />
        <View className="absolute size-32 rounded-full border border-foreground/20" />
        <View className="size-20 items-center justify-center overflow-hidden rounded-full border border-foreground/20">
          <LinearGradient
            colors={[
              withAlpha(colors.primary.pink, 0.2),
              withAlpha(colors.accent.yellow, 0.2),
            ]}
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

import { Card } from '@/components/ui/Card';
import { useScheme } from '@/hooks/useTheme';
import { useSaveCalendarPrefs } from '@/modules/calendar/hooks/useSaveCalendarPrefs';
import {
  calendarConnectedAtom,
  checkInTimingAtom,
  selectedCalendarIdsAtom,
  supportToneAtom,
} from '@/modules/calendar/store/calendar';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtomValue } from 'jotai';
import { Text } from '@/components/themed/Text';
import { Pressable, View } from 'react-native';
import { OnboardingLayout } from '../components/OnboardingLayout';

const PRIVACY_FEATURES: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  iconBg: string;
  title: string;
  description: string;
}[] = [
  {
    icon: 'security',
    iconBg: colors.status.danger,
    title: 'No Data Sales',
    description: 'We never sell your personal metrics to third parties.',
  },
  {
    icon: 'visibility-off',
    iconBg: colors.gradient.amber,
    title: 'Private Events',
    description: "We don't read or analyze your specific event details.",
  },
  {
    icon: 'settings-suggest',
    iconBg: '#555555',
    title: 'Granular Control',
    description: 'You decide which sensors and permissions are active.',
  },
];

export default function PrivacyTrust() {
  const scheme = useScheme();
  const lockIconColor = foregroundFor(scheme, { dark: 0.3, light: 0.4 });

  const calendarConnected = useAtomValue(calendarConnectedAtom);
  const selectedCalendarIds = useAtomValue(selectedCalendarIdsAtom);
  const checkInTiming = useAtomValue(checkInTimingAtom);
  const supportTone = useAtomValue(supportToneAtom);

  const saveCalendarPrefs = useSaveCalendarPrefs();

  const handleContinue = () => {
    if (calendarConnected) {
      saveCalendarPrefs.mutate({
        calendarConnected,
        selectedCalendarIds,
        checkInTiming,
        supportTone,
      });
    }
    router.push('/onboarding/completion');
  };

  return (
    <OnboardingLayout
      step={7}
      title="Your Data, Your Sanctuary."
      titleClassName="text-[28px] font-extrabold leading-tight tracking-tight text-foreground text-center"
      subtitle="PHOBIK is designed to protect your privacy while mapping your nervous system."
      subtitleClassName="mt-3 text-base font-normal leading-relaxed text-foreground/60 text-center"
      onBack={() => router.back()}
      buttonLabel="Continue"
      onButtonPress={handleContinue}
      scrollable={true}
      headerContent={
        <View className="items-center pb-2">
          <View
            className="h-24 w-24 items-center justify-center rounded-3xl"
            style={{
              backgroundColor: withAlpha(colors.status.danger, 0.1),
              borderWidth: 1,
              borderColor: withAlpha(colors.status.danger, 0.3),
              boxShadow: `0px 0px 20px ${withAlpha(colors.status.danger, 0.4)}`,
            }}
          >
            <MaterialIcons
              name="verified-user"
              size={36}
              color={colors.status.danger}
            />
          </View>
        </View>
      }
    >
      {/* Privacy feature cards */}
      <View className="gap-4">
        {PRIVACY_FEATURES.map((feature) => (
          <Card
            key={feature.title}
            className="flex-row items-center gap-4 px-4 py-3"
          >
            <View
              className="h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: feature.iconBg,
                boxShadow: `0px 0px 12px ${withAlpha(feature.iconBg, 0.4)}`,
              }}
            >
              <MaterialIcons name={feature.icon} size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-foreground">
                {feature.title}
              </Text>
              <Text className="mt-0.5 text-sm text-foreground/50">
                {feature.description}
              </Text>
            </View>
          </Card>
        ))}
      </View>

      {/* Bottom links */}
      <View className="mt-6 items-center gap-3">
        <Pressable>
          <Text className="text-sm font-medium text-foreground/40">
            Manage privacy settings
          </Text>
        </Pressable>
        <View className="flex-row items-center gap-1.5">
          <MaterialIcons name="lock" size={12} color={lockIconColor} />
          <Text variant="caption" className="text-foreground/30">
            End-to-End Encrypted
          </Text>
        </View>
      </View>
    </OnboardingLayout>
  );
}

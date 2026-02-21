import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { SelectionCard } from '@/modules/account-creation/components/SelectionCard';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { Pressable, Text, View } from 'react-native';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { SegmentedControl } from '../components/SegmentedControl';
import {
  onboardingCalendarConnectedAtom,
  onboardingCalendarTypesAtom,
  onboardingCheckInTimingAtom,
  onboardingSupportToneAtom,
  type CalendarType,
  type CheckInTiming,
  type SupportTone,
} from '../store/onboarding';

const TIMING_OPTIONS: { label: string; value: CheckInTiming }[] = [
  { label: '2 Days', value: '2-days' },
  { label: 'Day of', value: 'day-of' },
  { label: '1 Hour', value: '1-hour' },
];

const TONE_OPTIONS: {
  value: SupportTone;
  label: string;
  description: string;
}[] = [
  {
    value: 'gentle',
    label: 'Gentle',
    description: 'Soft nudges & breathing prompts.',
  },
  {
    value: 'subtle',
    label: 'Subtle',
    description: 'Minimalist reminders only.',
  },
  {
    value: 'direct',
    label: 'Direct',
    description: 'Clear, actionable preparation steps.',
  },
];

export default function CalendarSupport() {
  const [connected, setConnected] = useAtom(onboardingCalendarConnectedAtom);
  const [calendarTypes, setCalendarTypes] = useAtom(
    onboardingCalendarTypesAtom,
  );
  const [checkInTiming, setCheckInTiming] = useAtom(
    onboardingCheckInTimingAtom,
  );
  const [supportTone, setSupportTone] = useAtom(onboardingSupportToneAtom);

  const toggleCalendarType = (type: CalendarType) => {
    setCalendarTypes(
      calendarTypes.includes(type)
        ? calendarTypes.filter((t) => t !== type)
        : [...calendarTypes, type],
    );
  };

  return (
    <OnboardingLayout
      step={6}
      title="Sync Your Schedule"
      subtitle="PHOBIK notices upcoming events so you can prepare your nervous system before the stress hits."
      subtitleClassName="mt-3 text-base font-normal leading-relaxed text-primary-muted"
      onBack={() => router.back()}
      buttonLabel="Continue"
      onButtonPress={() => router.push('/onboarding/privacy-trust')}
    >
      {/* Calendar feature card */}
      <View className="mb-6 overflow-hidden rounded-2xl border border-white/5 bg-white/5">
        {/* Hero gradient */}
        <View className="h-36 items-center justify-center">
          <LinearGradient
            colors={['#4a1040', '#6b2450', '#8b4020', '#a06020']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          />
          <View
            className="items-center justify-center overflow-hidden rounded-2xl border border-white/30 p-4"
            style={{ backgroundColor: 'rgba(255,255,255,0.35)' }}
          >
            <BlurView intensity={20} tint="dark" className="absolute inset-0" />
            <MaskedView
              maskElement={
                <MaterialIcons name="calendar-month" size={48} color="black" />
              }
            >
              <LinearGradient
                colors={[colors.primary.pink, '#ff6b3d', colors.accent.yellow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: 48, height: 48 }}
              />
            </MaskedView>
          </View>
        </View>

        {/* Card content */}
        <View className="gap-4 p-5">
          <View>
            <Text className="text-xl font-bold text-white">
              Calendar Intelligence
            </Text>
            <Text className="mt-2 text-sm leading-relaxed text-primary-muted">
              We&apos;ll scan for high-stress keywords like &quot;Performance
              Review&quot; or &quot;Public Speaking&quot; to offer pre-emptive
              nervous system support.
            </Text>
          </View>

          {!connected && (
            <>
              <GradientButton
                onPress={() => setConnected(true)}
                icon={
                  <MaterialIcons
                    name="calendar-today"
                    size={18}
                    color="white"
                  />
                }
              >
                Connect my calendar
              </GradientButton>
              <Pressable
                onPress={() => router.push('/onboarding/privacy-trust')}
              >
                <Text className="text-center text-sm font-medium text-white/40">
                  Maybe later
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      {/* Post-connect sections */}
      {connected && (
        <View className="gap-6">
          {/* Calendar types */}
          <View>
            <View className="mb-3 flex-row items-center gap-2">
              <MaterialIcons
                name="check-circle"
                size={20}
                color={colors.primary.pink}
              />
              <Text className="text-base font-bold text-white">
                Which calendars to watch?
              </Text>
            </View>
            <View className="gap-2">
              {[
                {
                  type: 'work' as CalendarType,
                  label: 'Work',
                  color: '#3b82f6',
                },
                {
                  type: 'personal' as CalendarType,
                  label: 'Personal',
                  color: '#22c55e',
                },
              ].map((cal) => {
                const isSelected = calendarTypes.includes(cal.type);
                return (
                  <Pressable
                    key={cal.type}
                    onPress={() => toggleCalendarType(cal.type)}
                  >
                    <View className="flex-row items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                      <View className="flex-row items-center gap-3">
                        <View
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: cal.color }}
                        />
                        <Text className="font-medium text-white">
                          {cal.label}
                        </Text>
                      </View>
                      <View
                        className={`h-6 w-6 items-center justify-center rounded-full ${
                          isSelected
                            ? 'bg-primary-pink'
                            : 'border-2 border-white/20'
                        }`}
                      >
                        {isSelected && (
                          <MaterialIcons name="check" size={16} color="white" />
                        )}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Check-in timing */}
          <View>
            <Text className="mb-3 text-base font-bold text-white">
              When should we check in?
            </Text>
            <SegmentedControl
              options={TIMING_OPTIONS}
              selected={checkInTiming}
              onSelect={setCheckInTiming}
            />
          </View>

          {/* Support tone */}
          <View>
            <Text className="mb-3 text-base font-bold text-white">
              Choose your support tone
            </Text>
            <View className="gap-3">
              {TONE_OPTIONS.map((option) => (
                <SelectionCard
                  key={option.value}
                  label={option.label}
                  description={option.description}
                  selected={supportTone === option.value}
                  onPress={() => setSupportTone(option.value)}
                  variant="radio"
                />
              ))}
            </View>
          </View>
        </View>
      )}
    </OnboardingLayout>
  );
}
